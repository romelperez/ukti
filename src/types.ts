export type UktiLocales =
  | 'ab'
  | 'aa'
  | 'af'
  | 'ak'
  | 'sq'
  | 'am'
  | 'ar'
  | 'an'
  | 'hy'
  | 'as'
  | 'av'
  | 'ae'
  | 'ay'
  | 'az'
  | 'bm'
  | 'ba'
  | 'eu'
  | 'be'
  | 'bn'
  | 'bi'
  | 'bs'
  | 'br'
  | 'bg'
  | 'my'
  | 'ca'
  | 'ch'
  | 'ce'
  | 'ny'
  | 'zh'
  | 'cu'
  | 'cv'
  | 'kw'
  | 'co'
  | 'cr'
  | 'hr'
  | 'cs'
  | 'da'
  | 'dv'
  | 'nl'
  | 'dz'
  | 'en'
  | 'eo'
  | 'et'
  | 'ee'
  | 'fo'
  | 'fj'
  | 'fi'
  | 'fr'
  | 'fy'
  | 'ff'
  | 'gd'
  | 'gl'
  | 'lg'
  | 'ka'
  | 'de'
  | 'el'
  | 'kl'
  | 'gn'
  | 'gu'
  | 'ht'
  | 'ha'
  | 'he'
  | 'hz'
  | 'hi'
  | 'ho'
  | 'hu'
  | 'is'
  | 'io'
  | 'ig'
  | 'id'
  | 'ia'
  | 'ie'
  | 'iu'
  | 'ik'
  | 'ga'
  | 'it'
  | 'ja'
  | 'jv'
  | 'kn'
  | 'kr'
  | 'ks'
  | 'kk'
  | 'km'
  | 'ki'
  | 'rw'
  | 'ky'
  | 'kv'
  | 'kg'
  | 'ko'
  | 'kj'
  | 'ku'
  | 'lo'
  | 'la'
  | 'lv'
  | 'li'
  | 'ln'
  | 'lt'
  | 'lu'
  | 'lb'
  | 'mk'
  | 'mg'
  | 'ms'
  | 'ml'
  | 'mt'
  | 'gv'
  | 'mi'
  | 'mr'
  | 'mh'
  | 'mn'
  | 'na'
  | 'nv'
  | 'nd'
  | 'nr'
  | 'ng'
  | 'ne'
  | 'no'
  | 'nb'
  | 'nn'
  | 'ii'
  | 'oc'
  | 'oj'
  | 'or'
  | 'om'
  | 'os'
  | 'pi'
  | 'ps'
  | 'fa'
  | 'pl'
  | 'pt'
  | 'pa'
  | 'qu'
  | 'ro'
  | 'rm'
  | 'rn'
  | 'ru'
  | 'se'
  | 'sm'
  | 'sg'
  | 'sa'
  | 'sc'
  | 'sr'
  | 'sn'
  | 'sd'
  | 'si'
  | 'sk'
  | 'sl'
  | 'so'
  | 'st'
  | 'es'
  | 'su'
  | 'sw'
  | 'ss'
  | 'sv'
  | 'tl'
  | 'ty'
  | 'tg'
  | 'ta'
  | 'tt'
  | 'te'
  | 'th'
  | 'bo'
  | 'ti'
  | 'to'
  | 'ts'
  | 'tn'
  | 'tr'
  | 'tk'
  | 'tw'
  | 'ug'
  | 'uk'
  | 'ur'
  | 'uz'
  | 've'
  | 'vi'
  | 'vo'
  | 'wa'
  | 'cy'
  | 'wo'
  | 'xh'
  | 'yi'
  | 'yo'
  | 'za'
  | 'zu'

export type UktiDefinitionItemVariables = [Record<string, unknown>]

export type UktiDefinitionItem = undefined | UktiDefinitionItemVariables

export type UktiDefinition = Record<string, UktiDefinitionItem | Record<string, UktiDefinitionItem>>

type UktiTranslationValues<Definition extends UktiDefinition> = {
  [P in keyof Definition]: Definition[P] extends UktiDefinitionItemVariables
    ? string
    : undefined extends Definition[P]
      ? string
      : Definition[P] extends Record<string, UktiDefinitionItem>
        ? Record<keyof Definition[P], string>
        : never
}

type UktiLocaleDefault = 'en'

export type UktiTranslations<Definition extends UktiDefinition, Locales extends UktiLocales = UktiLocales, LocaleDefault extends UktiLocales = UktiLocaleDefault>
  = Partial<Record<Locales, UktiTranslationValues<Definition>>> & Record<LocaleDefault, UktiTranslationValues<Definition>>
