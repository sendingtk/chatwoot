<script setup>
import { computed } from 'vue';
import ConversationBasicFilter from './widgets/conversation/ConversationBasicFilter.vue';

const props = defineProps({
  pageTitle: {
    type: String,
    required: true,
  },
  hasAppliedFilters: {
    type: Boolean,
    required: true,
  },
  hasHideFiltersForAgents: {
    type: Boolean,
    required: true,
  },
  hasActiveFolders: {
    type: Boolean,
    required: true,
  },
  activeStatus: {
    type: String,
    required: true,
  },
  searchQuery: {
    type: String,
    default: '',
  },
});

const emits = defineEmits([
  'add-folders',
  'delete-folders',
  'reset-filters',
  'basic-filter-change',
  'filters-modal',
]);

const onBasicFilterChange = (value, type) => {
  emits('basic-filter-change', value, type);
};

const hasAppliedFiltersOrActiveFolders = computed(() => {
  return props.hasAppliedFilters || props.hasActiveFolders;
});
</script>

<template>
  <div>
    <div
      class="max-w-[400px] min-w-[150px] flex items-center relative mx-2 search-wrap"
    >
      <div class="flex items-center absolute h-full left-2.5">
        <fluent-icon
          icon="search"
          class="h-5 text-sm leading-9 text-slate-700 dark:text-slate-200"
        />
      </div>
      <input
        type="text"
        :placeholder="$t('CHAT_LIST.SEARCH_CHAT')"
        class="contact-search border-slate-100 dark:border-slate-600"
        :value="searchQuery"
        @input="$emit('input-search', $event)"
      />
    </div>
    <div
      class="flex items-center justify-between px-4 py-0"
      :class="{
        'pb-3 border-b border-slate-75 dark:border-slate-700':
          hasAppliedFiltersOrActiveFolders,
      }"
    >
      <div class="flex max-w-[85%] justify-center items-center">
        <h1
          class="text-xl font-medium break-words truncate text-black-900 dark:text-slate-100"
          :title="pageTitle"
        >
          {{ pageTitle }}
        </h1>
        <span
          v-if="!hasAppliedFiltersOrActiveFolders"
          class="p-1 my-0.5 mx-1 rounded-md capitalize bg-slate-50 dark:bg-slate-800 text-xxs text-slate-600 dark:text-slate-300"
        >
          {{ $t(`CHAT_LIST.CHAT_STATUS_FILTER_ITEMS.${activeStatus}.TEXT`) }}
        </span>
      </div>
      <div class="flex items-center gap-1">
        <div v-if="hasAppliedFilters && !hasActiveFolders">
          <woot-button
            v-tooltip.top-end="$t('FILTER.CUSTOM_VIEWS.ADD.SAVE_BUTTON')"
            size="tiny"
            variant="smooth"
            color-scheme="secondary"
            icon="save"
            @click="emits('add-folders')"
          />
          <woot-button
            v-tooltip.top-end="$t('FILTER.CLEAR_BUTTON_LABEL')"
            size="tiny"
            variant="smooth"
            color-scheme="alert"
            icon="dismiss-circle"
            @click="emits('reset-filters')"
          />
        </div>
        <div v-if="hasActiveFolders">
          <woot-button
            v-tooltip.top-end="$t('FILTER.CUSTOM_VIEWS.EDIT.EDIT_BUTTON')"
            size="tiny"
            variant="smooth"
            color-scheme="secondary"
            icon="edit"
            @click="emits('filters-modal')"
          />
          <woot-button
            v-tooltip.top-end="$t('FILTER.CUSTOM_VIEWS.DELETE.DELETE_BUTTON')"
            size="tiny"
            variant="smooth"
            color-scheme="alert"
            icon="delete"
            @click="emits('delete-folders')"
          />
        </div>
        <woot-button
          v-if="!hasHideFiltersForAgents && !hasActiveFolders"
          v-tooltip.right="$t('FILTER.TOOLTIP_LABEL')"
          variant="smooth"
          color-scheme="secondary"
          icon="filter"
          size="tiny"
          @click="emits('filters-modal')"
        />
        <conversation-basic-filter
          v-if="!hasAppliedFiltersOrActiveFolders"
          @changeFilter="onBasicFilterChange"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-wrap {
  .contact-search {
    @apply pl-9 pr-[3.75rem] text-sm w-full h-[2.375rem] m-0;
  }
}
</style>
