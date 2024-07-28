# Based on ISO_639-3 Codes. ref: https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes
# This Hash is used in account model, so do not change the index for existing languages

LANGUAGES_CONFIG = {
  0 => { name: 'English (en)', iso_639_3_code: 'eng', iso_639_1_code: 'en', enabled: true },
  9 => { name: 'Português (pt)', iso_639_3_code: 'por', iso_639_1_code: 'pt', enabled: true },
  12 => { name: 'Español (es)', iso_639_3_code: 'spa', iso_639_1_code: 'es', enabled: true },
  16 => { name: 'Português Brasileiro (pt-BR)', iso_639_3_code: '', iso_639_1_code: 'pt_BR', enabled: true },
}.filter { |_key, val| val[:enabled] }.freeze

Rails.configuration.i18n.available_locales = LANGUAGES_CONFIG.map { |_index, lang| lang[:iso_639_1_code].to_sym }
