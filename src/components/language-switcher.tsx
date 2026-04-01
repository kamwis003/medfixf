import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const availableLanguages = [
  { value: 'pl', label: 'Polski', flag: '🇵🇱' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'uk', label: 'Українська', flag: '🇺🇦' },
] as const

type LanguageValue = (typeof availableLanguages)[number]['value']

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = React.useState(false)

  // Ensure we're using the stored language or default to Polish
  React.useEffect(() => {
    const storedLang = localStorage.getItem('i18nextLng')
    if (!storedLang || !availableLanguages.some(lang => lang.value === storedLang)) {
      i18n.changeLanguage('pl')
    }
  }, [i18n])

  const currentLanguage =
    availableLanguages.find(lang => lang.value === i18n.language) || availableLanguages[0]

  const handleLanguageChange = (languageValue: LanguageValue) => {
    i18n.changeLanguage(languageValue)
    localStorage.setItem('i18nextLng', languageValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between gap-2 px-3"
        >
          {currentLanguage ? (
            <div className="flex items-center gap-2">
              <span className="text-base">{currentLanguage.flag}</span>
              <span className="text-sm font-medium">{currentLanguage.label}</span>
            </div>
          ) : (
            'Wybierz język...'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-45 p-0">
        <Command>
          <CommandList>
            <CommandEmpty>Nie znaleziono języka.</CommandEmpty>
            <CommandGroup>
              {availableLanguages.map(language => (
                <CommandItem
                  key={language.value}
                  value={language.label}
                  onSelect={() => handleLanguageChange(language.value)}
                >
                  <span className="mr-2 text-base">{language.flag}</span>
                  <span className={currentLanguage.value === language.value ? 'font-semibold' : ''}>
                    {language.label}
                  </span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentLanguage.value === language.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
