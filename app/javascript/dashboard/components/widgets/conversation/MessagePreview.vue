<script>
import { MESSAGE_TYPE } from 'widget/helpers/constants';
import { useMessageFormatter } from 'shared/composables/useMessageFormatter';
import { ATTACHMENT_ICONS } from 'shared/constants/messages';
import BubbleImageAudioVideo from './bubble/ImageAudioVideo.vue';
import InstagramStory from './bubble/InstagramStory.vue';
import BubbleLocation from './bubble/Location.vue';
import BubbleContact from './bubble/Contact.vue';
import BubbleFile from './bubble/File.vue';

export default {
  name: 'MessagePreview',
  components: {
    BubbleImageAudioVideo,
    InstagramStory,
    BubbleLocation,
    BubbleContact,
    BubbleFile,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    showMessageType: {
      type: Boolean,
      default: true,
    },
    defaultEmptyMessage: {
      type: String,
      default: '',
    },
    short: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { getPlainText } = useMessageFormatter();
    return {
      getPlainText,
    };
  },
  data: () => {
    return {
      previewMessage: null,
    };
  },
  computed: {
    contentAttributes() {
      return this.message.content_attributes || {};
    },
    isAnInstagramStory() {
      return this.contentAttributes.image_type === 'story_mention';
    },
    attachments() {
      return this.message?.attachments || [];
    },
    messageByAgent() {
      const { message_type: messageType } = this.message;
      return messageType === MESSAGE_TYPE.OUTGOING;
    },
    isMessageAnActivity() {
      const { message_type: messageType } = this.message;
      return messageType === MESSAGE_TYPE.ACTIVITY;
    },
    isMessagePrivate() {
      const { private: isPrivate } = this.message;
      return isPrivate;
    },
    parsedLastMessage() {
      return this.getPlainText(this.subject + this.message.content);
    },
    subject() {
      const { content_attributes: contentAttributes } = this.message;
      const { email: { subject } = {} } = contentAttributes || {};
      //return this.getPlainText(subject || this.message.content);
      return subject ? subject + ' - ' : '';
    },
    lastMessageFileType() {
      const [{ file_type: fileType } = {}] = this.message.attachments;
      return fileType;
    },
    attachmentIcon() {
      return ATTACHMENT_ICONS[this.lastMessageFileType];
    },
    attachmentMessageContent() {
      return `CHAT_LIST.ATTACHMENTS.${this.lastMessageFileType}.CONTENT`;
    },
    isMessageSticker() {
      return this.message && this.message.content_type === 'sticker';
    },
  },
  watch: {
    data() {
      this.hasMediaLoadError = false;
    },
  },
  mounted() {
    this.hasMediaLoadError = false;
  },
  methods: {
    isAttachmentImageVideoAudio(fileType) {
      return ['image', 'audio', 'video', 'story_mention', 'ig_reel'].includes(
        fileType
      );
    },
    onMediaLoadError() {
      this.hasMediaLoadError = true;
    },
  },
};
</script>

<template>
  <div class="overflow-hidden text-ellipsis whitespace-nowrap">
    <template v-if="showMessageType">
      <fluent-icon
        v-if="isMessagePrivate"
        size="16"
        class="-mt-0.5 align-middle text-slate-600 dark:text-slate-300 inline-block"
        icon="lock-closed"
      />
      <fluent-icon
        v-else-if="messageByAgent"
        size="16"
        class="-mt-0.5 align-middle text-slate-600 dark:text-slate-300 inline-block"
        icon="arrow-reply"
      />
      <fluent-icon
        v-else-if="isMessageAnActivity"
        size="16"
        class="-mt-0.5 align-middle text-slate-600 dark:text-slate-300 inline-block"
        icon="info"
      />
    </template>
    <span v-if="message.content && isMessageSticker">
      <fluent-icon
        size="16"
        class="-mt-0.5 align-middle inline-block text-slate-600 dark:text-slate-300"
        icon="image"
      />
      {{ $t('CHAT_LIST.ATTACHMENTS.image.CONTENT') }}
    </span>
    <span v-else-if="message.content">
      {{ parsedLastMessage }}
    </span>
    <span v-else-if="message.attachments">
      <div v-if="short">
        <fluent-icon
          v-if="attachmentIcon && showMessageType"
          size="16"
          class="-mt-0.5 align-middle inline-block text-slate-600 dark:text-slate-300"
          :icon="attachmentIcon"
        />
        {{ $t(`${attachmentMessageContent}`) }}
      </div>
      <div v-else>
        <div v-for="attachment in attachments" :key="attachment.id">
          <InstagramStory
            v-if="isAnInstagramStory"
            :story-url="attachment.thumb_url"
            @error="onMediaLoadError"
          />
          <BubbleImageAudioVideo
            v-else-if="isAttachmentImageVideoAudio(attachment.file_type)"
            :attachment="attachment"
            url_type="thumb_url"
            @error="onMediaLoadError"
          />
          <BubbleLocation
            v-else-if="attachment.file_type === 'location'"
            :latitude="attachment.coordinates_lat"
            :longitude="attachment.coordinates_long"
            :name="attachment.fallback_title"
          />
          <BubbleContact
            v-else-if="attachment.file_type === 'contact'"
            :name="message.content"
            :phone-number="attachment.fallback_title"
          />
          <BubbleFile v-else :url="attachment.thumb_url" />
        </div>
      </div>
    </span>
    <span v-else>
      {{ defaultEmptyMessage || $t('CHAT_LIST.NO_CONTENT') }}
    </span>
  </div>
</template>
