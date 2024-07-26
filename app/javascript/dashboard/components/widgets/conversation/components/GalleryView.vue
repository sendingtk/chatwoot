<template>
  <woot-modal
    full-width
    :show.sync="show"
    :show-close-button="false"
    :on-close="onClose"
  >
    <div
      v-on-clickaway="onClose"
      class="bg-white dark:bg-slate-900 flex flex-col h-[inherit] w-[inherit] overflow-hidden"
      @click="onClose"
    >
      <div
        class="z-10 flex items-center justify-between w-full h-16 px-6 py-2 bg-white dark:bg-slate-900"
        @click.stop
      >
        <div
          v-if="senderDetails"
          class="items-center flex justify-start min-w-[15rem]"
        >
          <thumbnail
            v-if="senderDetails.avatar"
            :username="senderDetails.name"
            :src="senderDetails.avatar"
          />
          <div
            class="flex flex-col items-start justify-center ml-2 rtl:ml-0 rtl:mr-2"
          >
            <h3 class="text-base inline-block leading-[1.4] m-0 p-0 capitalize">
              <span
                class="overflow-hidden text-slate-800 dark:text-slate-100 whitespace-nowrap text-ellipsis"
              >
                {{ senderDetails.name }}
              </span>
            </h3>
            <span
              class="p-0 m-0 overflow-hidden text-xs text-slate-400 dark:text-slate-200 whitespace-nowrap text-ellipsis"
            >
              {{ readableTime }}
            </span>
          </div>
        </div>
        <div
          class="flex items-center justify-start w-auto min-w-0 p-1 text-sm font-semibold text-slate-700 dark:text-slate-100"
        >
          <span
            v-dompurify-html="fileNameFromDataUrl"
            class="overflow-hidden text-slate-700 dark:text-slate-100 whitespace-nowrap text-ellipsis"
          />
        </div>
        <div
          class="items-center flex gap-2 justify-end min-w-[8rem] sm:min-w-[15rem]"
        >
          <woot-button
            v-if="isImage"
            size="large"
            color-scheme="secondary"
            variant="clear"
            icon="zoom-out"
            @click="onZoom(-0.1)"
          />
          <woot-button
            v-if="isImage"
            size="large"
            color-scheme="secondary"
            variant="clear"
            icon="arrow-rotate-counter-clockwise"
            @click="onRotate('counter-clockwise')"
          />
          <woot-button
            v-if="isImage"
            size="large"
            color-scheme="secondary"
            variant="clear"
            icon="arrow-rotate-clockwise"
            @click="onRotate('clockwise')"
          />
          <woot-button
            size="large"
            color-scheme="secondary"
            variant="clear"
            icon="arrow-download"
            @click="onClickDownload"
          />
          <woot-button
            size="large"
            color-scheme="secondary"
            variant="clear"
            icon="dismiss"
            @click="onClose"
          />
        </div>
      </div>
      <div class="flex items-center justify-center w-full h-full">
        <div class="flex justify-center min-w-[6.25rem] w-[6.25rem]">
          <woot-button
            v-if="hasMoreThanOneAttachment"
            class="z-10"
            size="large"
            variant="smooth"
            color-scheme="primary"
            icon="chevron-left"
            :disabled="activeImageIndex === 0"
            @click.stop="
              onClickChangeAttachment(
                allAttachments[activeImageIndex - 1],
                activeImageIndex - 1
              )
            "
          />
        </div>
        <div class="flex items-center justify-center w-full h-full">
          <div class="flex flex-col items-center justify-center w-full h-full">
            <div
              class="image-container"
              ref="imageContainer"
              @mousedown="onPanStart"
              @mousemove="onPanMove"
              @mouseup="onPanEnd"
            >
              <img
                v-if="isImage"
                :key="activeAttachment.message_id"
                :src="activeAttachment.data_url"
                class="mx-auto my-0 duration-150 ease-in-out transform modal-image skip-context-menu"
                :style="imageStyle"
                @wheel.stop="onWheelImageZoom"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-center min-w-[6.25rem] w-[6.25rem]">
          <woot-button
            v-if="hasMoreThanOneAttachment"
            class="z-10"
            size="large"
            variant="smooth"
            color-scheme="primary"
            :disabled="activeImageIndex === allAttachments.length - 1"
            icon="chevron-right"
            @click.stop="
              onClickChangeAttachment(
                allAttachments[activeImageIndex + 1],
                activeImageIndex + 1
              )
            "
          />
        </div>
      </div>
      <div class="z-10 flex items-center justify-center w-full h-16 px-6 py-2">
        <div
          class="items-center rounded-sm flex font-semibold justify-center min-w-[5rem] p-1 bg-slate-25 dark:bg-slate-800 text-slate-600 dark:text-slate-200 text-sm"
        >
          <span class="count">
            {{ `${activeImageIndex + 1} / ${allAttachments.length}` }}
          </span>
        </div>
      </div>
    </div>
  </woot-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import keyboardEventListenerMixins from 'shared/mixins/keyboardEventListenerMixins';
import { messageTimestamp } from 'shared/helpers/timeHelper';

import Thumbnail from 'dashboard/components/widgets/Thumbnail.vue';

const ALLOWED_FILE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  IG_REEL: 'ig_reel',
  AUDIO: 'audio',
};

const MAX_ZOOM_LEVEL = 2;
const MIN_ZOOM_LEVEL = 1;

export default {
  components: {
    Thumbnail,
  },
  mixins: [keyboardEventListenerMixins],
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    attachment: {
      type: Object,
      required: true,
    },
    allAttachments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      zoomScale: 1,
      panX: 0,
      panY: 0,
      panStartX: 0,
      panStartY: 0,
      isPanning: false,
      activeAttachment: {},
      activeFileType: '',
      activeImageIndex:
        this.allAttachments.findIndex(
          attachment => attachment.message_id === this.attachment.message_id
        ) || 0,
      activeImageRotation: 0,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
    }),
    hasMoreThanOneAttachment() {
      return this.allAttachments.length > 1;
    },
    readableTime() {
      const { created_at: createdAt } = this.activeAttachment;
      if (!createdAt) return '';
      return messageTimestamp(createdAt, 'LLL d yyyy, h:mm a') || '';
    },
    isImage() {
      return this.activeFileType === ALLOWED_FILE_TYPES.IMAGE;
    },
    isVideo() {
      return (
        this.activeFileType === ALLOWED_FILE_TYPES.VIDEO ||
        this.activeFileType === ALLOWED_FILE_TYPES.IG_REEL
      );
    },
    isAudio() {
      return this.activeFileType === ALLOWED_FILE_TYPES.AUDIO;
    },
    senderDetails() {
      const {
        name,
        available_name: availableName,
        avatar_url,
        thumbnail,
        id,
      } = this.activeAttachment?.sender || this.attachment?.sender || {};
      const currentUserID = this.currentUser?.id;
      return {
        name: currentUserID === id ? 'You' : name || availableName || '',
        avatar: thumbnail || avatar_url || '',
      };
    },
    fileNameFromDataUrl() {
      const { data_url: dataUrl } = this.activeAttachment;
      if (!dataUrl) return '';
      const fileName = dataUrl?.split('/').pop();
      return decodeURIComponent(fileName || '');
    },
    imageStyle() {
      return {
        transform: `scale(${this.zoomScale}) translate(${this.panX}px, ${this.panY}px) rotate(${this.activeImageRotation}deg)`,
        cursor: this.zoomScale < MAX_ZOOM_LEVEL ? 'zoom-in' : 'zoom-out',
      };
    },
  },
  mounted() {
    this.setImageAndVideoSrc(this.attachment);
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onClickChangeAttachment(attachment, index) {
      if (!attachment) {
        return;
      }
      this.activeImageIndex = index;
      this.setImageAndVideoSrc(attachment);
      this.resetZoomAndPan();
    },
    setImageAndVideoSrc(attachment) {
      const { file_type: type } = attachment;
      if (!Object.values(ALLOWED_FILE_TYPES).includes(type)) {
        return;
      }
      this.activeAttachment = attachment;
      this.activeFileType = type;
    },
    getKeyboardEvents() {
      return {
        Escape: {
          action: () => {
            this.onClose();
          },
        },
        ArrowLeft: {
          action: () => {
            this.onClickChangeAttachment(
              this.allAttachments[this.activeImageIndex - 1],
              this.activeImageIndex - 1
            );
          },
        },
        ArrowRight: {
          action: () => {
            this.onClickChangeAttachment(
              this.allAttachments[this.activeImageIndex + 1],
              this.activeImageIndex + 1
            );
          },
        },
      };
    },
    onClickDownload() {
      const { file_type: type, data_url: url } = this.activeAttachment;
      if (!Object.values(ALLOWED_FILE_TYPES).includes(type)) {
        return;
      }
      const link = document.createElement('a');
      link.href = url;
      link.download = `attachment.${type}`;
      link.click();
    },
    onRotate(type) {
      if (!this.isImage) {
        return;
      }

      const rotation = type === 'clockwise' ? 90 : -90;

      // Reset rotation if it is 360
      if (Math.abs(this.activeImageRotation) === 360) {
        this.activeImageRotation = rotation;
      } else {
        this.activeImageRotation += rotation;
      }
    },

    onZoom(scale) {
      if (!this.isImage) {
        return;
      }

      const newZoomScale = this.zoomScale + scale;
      // Check if the new zoom scale is within the allowed range
      if (newZoomScale > MAX_ZOOM_LEVEL) {
        // Set zoom to max but do not reset to default
        this.zoomScale = MAX_ZOOM_LEVEL;
        return;
      }
      if (newZoomScale < MIN_ZOOM_LEVEL) {
        // Set zoom to min but do not reset to default
        this.zoomScale = MIN_ZOOM_LEVEL;
        this.panX = 0;
        this.panY = 0;
        return;
      }
      // If within bounds, update the zoom scale
      this.zoomScale = newZoomScale;
    },
    onWheelImageZoom(e) {
      if (!this.isImage) {
        return;
      }

      const scale = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoomScale = this.zoomScale + scale;

      // Check if the new zoom scale is within the allowed range
      if (newZoomScale > MAX_ZOOM_LEVEL) {
        this.zoomScale = MAX_ZOOM_LEVEL;
        return;
      }
      if (newZoomScale < MIN_ZOOM_LEVEL) {
        this.zoomScale = MIN_ZOOM_LEVEL;
        // Reset pan to default when zoom is at minimum
        this.panX = 0;
        this.panY = 0;
        return;
      }

      // Calculate the focal point of the zoom
      const rect = e.target.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left) / rect.width;
      const offsetY = (e.clientY - rect.top) / rect.height;

      const newPanX =
        this.panX -
        (offsetX - 0.5) * (newZoomScale - this.zoomScale) * rect.width;
      const newPanY =
        this.panY -
        (offsetY - 0.5) * (newZoomScale - this.zoomScale) * rect.height;

      this.zoomScale = newZoomScale;
      this.panX = newPanX;
      this.panY = newPanY;
    },

    onPanStart(event) {
      if (!this.isImage || this.zoomScale === 1) {
        return;
      }

      this.isPanning = true;
      this.panStartX = event.clientX;
      this.panStartY = event.clientY;

      this.$refs.imageContainer.style.cursor = 'grabbing';
    },

    onPanMove(event) {
      if (!this.isPanning || this.zoomScale === 1 || !this.$refs.image) return;

      const deltaX = event.clientX - this.panStartX;
      const deltaY = event.clientY - this.panStartY;

      this.panX += deltaX;
      this.panY += deltaY;

      this.panStartX = event.clientX;
      this.panStartY = event.clientY;

      requestAnimationFrame(() => {
        this.$refs.imageContainer.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomScale})`;
      });
    },

    onPanEnd() {
      if (this.zoomScale === 1) {
        return;
      }

      this.isPanning = false; 
      this.$refs.imageContainer.style.cursor = 'grab';
    },

    resetZoomAndPan() {
      this.zoomScale = 1;
      this.panX = 0;
      this.panY = 0;
      this.activeImageRotation = 0;
    },
  },
};
</script>

<style scoped>
.image-container {
  overflow: hidden;
  position: relative;
}

.modal-image {
  transition: transform 0.3s ease;
  user-select: none; /* Evitar seleção de texto durante o pan */
  cursor: grab; /* Alterar cursor durante o pan */
}

.image-container:active .modal-image {
  cursor: grabbing; /* Alterar cursor ativo durante o pan */
}
</style>
