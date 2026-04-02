import type { SpecialistType } from '@/types/fertility'

export interface IDoctor {
  id: string
  name: string
  specialization: string
  description: string
  avatarUrl: string
  isRecommended: boolean
}

export const mockDoctors: Record<SpecialistType, IDoctor[]> = {
  gynecologist: [
    {
      id: 'g1',
      name: 'dr Anna Kowalska',
      specialization: 'Ginekolog',
      description: 'Specjalistka ginekologii i położnictwa z 15-letnim doświadczeniem.',
      avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=AnnaKowalska',
      isRecommended: true,
    },
    {
      id: 'g2',
      name: 'dr Marta Wiśniewska',
      specialization: 'Ginekolog',
      description: 'Ekspertka w leczeniu endometriozy i PCOS.',
      avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=MartaWisniewska',
      isRecommended: true,
    },
    {
      id: 'g3',
      name: 'dr Joanna Nowak',
      specialization: 'Ginekolog',
      description: 'Doświadczona ginekolog, specjalizuje się w ciąży wysokiego ryzyka.',
      avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=JoannaNowak',
      isRecommended: false,
    },
  ],
  fertility_specialist: [
    {
      id: 'f1',
      name: 'dr Piotr Zając',
      specialization: 'Specjalista ds. płodności',
      description: 'Pionier technik wspomaganego rozrodu w Polsce, ponad 20 lat praktyki.',
      avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=PiotrZajac',
      isRecommended: true,
    },
    {
      id: 'f2',
      name: 'dr Katarzyna Malinowska',
      specialization: 'Specjalista ds. płodności',
      description: 'Specjalistka leczenia niepłodności metodą in vitro.',
      avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=KatarzynaMalinowska',
      isRecommended: true,
    },
    {
      id: 'f3',
      name: 'dr Tomasz Lewandowski',
      specialization: 'Specjalista ds. płodności',
      description: 'Androlog i specjalista niepłodności męskiej.',
      avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=TomaszLewandowski',
      isRecommended: false,
    },
  ],
  endocrinologist: [
    {
      id: 'e1',
      name: 'dr Ewa Dąbrowska',
      specialization: 'Endokrynolog',
      description: 'Ekspertka zaburzeń hormonalnych wpływających na płodność.',
      avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=EwaDabrowska',
      isRecommended: true,
    },
    {
      id: 'e2',
      name: 'dr Michał Wróbel',
      specialization: 'Endokrynolog',
      description: 'Specjalista chorób tarczycy i zespołu metabolicznego.',
      avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=MichalWrobel',
      isRecommended: true,
    },
    {
      id: 'e3',
      name: 'dr Agnieszka Krawczyk',
      specialization: 'Endokrynolog',
      description: 'Specjalistka PCOS i insulinooporności.',
      avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=AgnieszkaKrawczyk',
      isRecommended: false,
    },
  ],
}
