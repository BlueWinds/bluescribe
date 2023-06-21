import { buildErrorMessage } from '~/assets/shared/battlescribe/bs_error'
import { TestRoster, TestSystemDefinition } from '../globlal_tests_helpers'

const useTempRosters = false
const tempTestRosters40k: TestRoster[] = []
const autocheckTestRosters40k: TestRoster[] = [
  {
    file: 'RubricMarinesAutocheck.rosz', // Create a Terminator (sub unit), its weapon should be automatically enabled.
    roster: null,
    print: false,
    actions: ['warpflamer/+'],
    exportSettings: { asText: true, format: 'NR', includeConstants: true },
    export: `
Chaos - Thousand Sons - rfffff - [27pts, 6PL]
## Patrol Detachment -2CP [27pts, 6PL]
### Troops [27pts, 6PL]
Rubric Marines [27pts, 6PL]: Rubric Marine w/ warpflamer, Warpflamer
  `,
  },
  {
    file: 'AsurmenNoDelete.rosz', // Create a Terminator (sub unit), its weapon should be automatically enabled.
    roster: null,
    print: false,
    actions: ['Craftworld Selection/Strength From Death'],
    exportSettings: { asText: true, format: 'NR' },
    export: `
Aeldari - Craftworlds - hhhhhhhh - [150pts, 8PL]
## Patrol Detachment -2CP [150pts, 8PL]
### Configuration
Craftworld Selection: Ynnari: Strength From Death
### HQ [150pts, 8PL]
Asurmen [150pts, 8PL]
`,
  },
  {
    file: 'Terminator.rosz', // Create a Terminator (sub unit), its weapon should be automatically enabled.
    roster: null,
    print: false,
    actions: ['Terminator/Heavy Weapon/+'],
    exportSettings: { asText: true, format: 'NR' },
    export: `
Chaos - Thousand Sons - TS_duplicity_ca2022_v1 - [45pts, 10PL]
## Battalion Detachment -3CP [45pts, 10PL]
### Elites [45pts, 10PL]
Scarab Occult Terminators [45pts, 10PL]
• Terminator w/ Heavy Weapon [45pts]: Heavy warpflamer
`,
  },
  {
    file: 'Terminator.rosz', // Create, Remove and Recreate a Terminator (sub unit), its weapon should be automatically enabled.
    roster: null,
    print: false,
    actions: ['Terminator/Heavy Weapon/+', 'Terminator/Heavy Weapon/-', 'Terminator/Heavy Weapon/+'],
    exportSettings: { asText: true, format: 'NR' },
    export: `
Chaos - Thousand Sons - TS_duplicity_ca2022_v1 - [45pts, 10PL]
## Battalion Detachment -3CP [45pts, 10PL]
### Elites [45pts, 10PL]
Scarab Occult Terminators [45pts, 10PL]
• Terminator w/ Heavy Weapon [45pts]: Heavy warpflamer
`,
  },
  {
    file: 'emptyForce.rosz', // select another Battle Size option, should uncheck the previous one.
    roster: null,
    print: false,
    actions: ['Battle Size/Incursion'],
    exportSettings: { asText: true, format: 'NR' },
    export: `
Chaos - Thousand Sons - TS_duplicity_ca2022_v1 - [6CP]
## Battalion Detachment -3CP [6CP]
### Configuration [6CP]
Battle Size [6CP]: Incursion (51-100 Total PL / 501-1000 Points)
`,
  },
  {
    file: 'emptyForce.rosz', // make Battle Size have no selections
    roster: null,
    print: true,
    actions: ['Battle Size/Strike'],
    exportSettings: { asText: true, format: 'NR' },
    export: `
Chaos - Thousand Sons - TS_duplicity_ca2022_v1
## Battalion Detachment -3CP
### Configuration
Battle Size
`,
  },
]
const actualTestRosters40k: TestRoster[] = [
  {
    file: 'TS_duplicity_ca2022_v1.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 2000 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 100 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 9 },
      { name: ' Cabal Points', typeId: '6a06-928d-a42e-4293', value: 15 },
    ],
    roster: null,
  },
  {
    file: 'TS_duplicity_ca2022_v2.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 1997 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 100 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 9 },
      { name: ' Cabal Points', typeId: '6a06-928d-a42e-4293', value: 15 },
    ],
    roster: null,
  },
  {
    file: 'TS_duplicity_ca2022_v3.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 1996 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 102 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 10 },
      { name: ' Cabal Points', typeId: '6a06-928d-a42e-4293', value: 16 },
    ],
    roster: null,
  },
  {
    file: 'TS_duplicity_ca2022_v5.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 1999 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 100 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 8 },
      { name: ' Cabal Points', typeId: '6a06-928d-a42e-4293', value: 16 },
    ],
    roster: null,
  },
  {
    file: 'TS_duplicity_magnus_v1.rosz',
    errors: ["<i><span class='optName'>Roster</span> is limited to <strong class='red'>2000 pts</strong>"] as any,
    costs: [
      { typeId: 'points', name: 'pts', value: 2019 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 105 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 9 },
      { name: ' Cabal Points', typeId: '6a06-928d-a42e-4293', value: 16 },
    ],
    roster: null,
  },
  {
    file: 'HostoftheIntermediaryChildId.rosz',
    errors: [
      'Host of the Intermediary has 1 selections while being hidden',
      'Roster is limited to 0 selections of Host of the Intermediary',
      'Roster is limited to 2000 pts',
    ],

    costs: [
      { typeId: 'points', name: 'pts', value: 2016 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 106 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 11 },
    ],
    roster: null,
  },
  {
    file: 'MBH-x-EC_4.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 1997 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 110 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 8 },
    ],
    roster: null,
  },
  {
    file: 'Test_admec.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 1999 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 104 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 8 },
    ],
    roster: null,
  },
  {
    file: 'Test_eldar.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 1995 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 106 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 8 },
    ],
    roster: null,
  },
  {
    file: 'TSKCA2022V6.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 2000 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 107 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 10 },
    ],
    roster: null,
  },
  {
    file: 'Ulthwe_test_warp.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 2000 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 109 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 9 },
    ],
    roster: null,
  },
  {
    file: '12AvatarKhaine.rosz',
    errors: [
      buildErrorMessage('Roster', 'min', 1, 'selections', false, 'Battle Size'),
      buildErrorMessage('Roster', 'min', 1, 'selections', false, 'Warlord'),
      buildErrorMessage('Battalion Detachment -3CP', 'min', 1, 'selections', false, 'Craftworld Selection'),
      buildErrorMessage('Configuration', 'min', 1, 'selections', false, 'Detachment Command Cost'),
      buildErrorMessage('Battalion Detachment -3CP', 'max', 3, 'selections', false, 'HQ'),
      buildErrorMessage('Roster', 'max', 1, 'selections', false, 'Avatar of Khaine'),
      buildErrorMessage('Battalion Detachment -3CP', 'min', 3, 'selections', false, 'Troops'),
    ],
    costs: [],
    roster: null,
  },
  {
    skip: true,
    file: 'AutarchWarlockSkyrunners.rosz',
    errors: [1, 2] as any,
    costs: [],
    roster: null,
    // details: "WalordSkyrunners/addAsuryaniWarlord/shared is the cause",
  },
  {
    file: 'Chaos-Aeldari-CategoryConstraints.rosz',
    errors: [
      buildErrorMessage('Roster', 'max', 5, 'pts', false),
      buildErrorMessage('Roster', 'max', 5, 'PL', false),
      buildErrorMessage('Roster', 'max', 5, 'CP', false),
      buildErrorMessage('Patrol Detachment 0CP', 'max', 2, 'selections', false, 'HQ'),
      buildErrorMessage('Patrol Detachment 0CP', 'min', 1, 'selections', false, 'Troops'),
      buildErrorMessage('Patrol Detachment -2CP', 'min', 1, 'selections', false, 'HQ'),
      buildErrorMessage('Patrol Detachment -2CP', 'max', 3, 'selections', false, 'Troops'),
      buildErrorMessage('Patrol Detachment -2CP', 'min', 5, 'selections', false, 'Troops'),
    ],
    costs: [],
    roster: null,
  },
  {
    file: 'GenestealerHidden.rosz',
    errors: ['Proficient Planning: ' + buildErrorMessage('A Perfect Ambush', 'hidden', '1', 'selections')],
    costs: [],
    roster: null,
  },
  {
    file: 'CaptainPistol.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 209 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 15 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 3 },
    ],
    roster: null,
  },
  {
    file: 'GrimaldusLitanyNotInstanceof.rosz',
    errors: [
      'Roster requires a minimum of 1 selections of Warlord',
      'Patrol Detachment -2CP requires a minimum of 1 selections of Troops',
    ],
    costs: [
      { typeId: 'points', name: 'pts', value: 140 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 7 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 1 },
    ],
    roster: null,
  },
  {
    file: 'ChildForce.rosz',
    errors: [],
    costs: [
      { typeId: 'points', name: 'pts', value: 1345 },
      { typeId: 'e356-c769-5920-6e14', name: ' PL', value: 73 },
      { typeId: '2d3b-b544-ad49-fb75', name: 'CP', value: 1 },
      { name: ' Cabal Points', typeId: '6a06-928d-a42e-4293', value: 4 },
    ],
    roster: null,
  },
  ...autocheckTestRosters40k,
  ...tempTestRosters40k,
]

export const testRosters40k = useTempRosters ? tempTestRosters40k : actualTestRosters40k

export const testsSystems: TestSystemDefinition[] = [
  {
    name: 'Test Game System',
    paths: ['./test/bsdata/tgs', './test/bsrosters/tgs'],
    testRosters: [
      {
        file: 'SharedRoster.rosz',
        errors: [],
        costs: [{ typeId: '8e89-22f9-7df2-714e', name: 'pt', value: 2 }],
        roster: null,
      },
      {
        file: 'Test1.rosz',
        errors: ['Armour has 1 selections while being hidden'],
        costs: [{ typeId: '8e89-22f9-7df2-714e', name: 'pt', value: 212 }],
        roster: null,
      },
    ],
  },
  {
    name: 'Warhammer 40k',
    paths: ['./test/bsdata/wh40k', './test/bsrosters/wh40k'],
    testRosters: testRosters40k,
  },
  {
    name: 'Age of Sigmar',
    paths: ['./test/bsdata/aos', './test/bsrosters/aos'],
    testRosters: [
      {
        file: 'Test.rosz', // Create a Terminator (sub unit), its weapon should be automatically enabled.
        roster: null,
        print: false,
        actions: ['Arkhan the Black/add'],
        exportSettings: { asText: true, format: 'NR' },
        export: `
        Death - Ossiarch Bonereapers - Test - [950pts]

        ## **Pitched Battle GHB 2023**2,000 [950pts]

        ### Leader [370pts]
        Arkhan the Black, Mortarch of Sacrament [370pts]
        
        ### Behemoth [370pts]
        
        ### Battleline [580pts]
        Kavalos Deathriders [170pts]: Nadirite Blade
        Kavalos Deathriders [170pts]: Nadirite Blade
        Morghast Archai [240pts]: Spirit Halberd
        
        ### Allegiance
        Allegiance: The Ossiarch Empire
        
        ### Game Options
        Game Type: 2000 Points - Battlehost
        Grand Strategy
    `,
      },
      {
        file: 'Test.rosz', // Create a Terminator (sub unit), its weapon should be automatically enabled.
        roster: null,
        print: false,
        actions: ['Arkhan the Black/add', 'Arkhan the Black/-'],
        exportSettings: { asText: true, format: 'NR' },
        export: `
        Death - Ossiarch Bonereapers - Test - [580pts]

## **Pitched Battle GHB 2023**2,000 [580pts]

### Battleline [340pts]
Kavalos Deathriders [170pts]: Nadirite Blade
Kavalos Deathriders [170pts]: Nadirite Blade

### Other [240pts]
Morghast Archai [240pts]: Spirit Halberd

### Allegiance
Allegiance: The Ossiarch Empire

### Game Options
Game Type: 2000 Points - Battlehost
Grand Strategy
    `,
      },
    ],
  },
  {
    name: 'WAP',
    paths: ['./test/bsdata/wap', './test/bsrosters/wap'],
    testRosters: [
      {
        file: 'MagicItems60.rosz',
        errors: [
          'Standard requires a minimum of 1 selections of General',
          'Standard requires a minimum of 1 selections of Hierophant ',
          'Tomb King is limited to 100 pts of Magic Items',
        ],
        costs: [{ typeId: 'points', name: 'pts', value: 280 }],
        roster: null,
      },
      {
        file: 'Empty.rosz', // Create a Terminator (sub unit), its weapon should be automatically enabled.
        roster: null,
        // export: "./test/bsexport/wh40k/TS_duplicity_ca2022_v1_2022.txt",
        print: false,
        actions: ['Savage Orc Boar Boyz/+'],
        exportSettings: { asText: true, format: 'NR', includeConstants: true },
        export: `
        Orcs & Goblins - rrrrr - [100pts]
        ## Standard [100pts]
        ### Special [100pts]
        Savage Orc Boar Boyz [100pts]: 5x Savage Orc Boar Boy, Hand Weapon, Shield, War Boar
      `,
      },
      {
        file: 'Empty.rosz', // Create a Terminator (sub unit), its weapon should be automatically enabled.
        roster: null,
        // export: "./test/bsexport/wh40k/TS_duplicity_ca2022_v1_2022.txt",
        print: false,
        actions: ['Savage Orc Boar Boyz/+', 'Savage Orc Boar Boyz/-'],
        exportSettings: { asText: true, format: 'NR', includeConstants: true },
        export: `
        Orcs & Goblins - rrrrr
        ## Standard
      `,
      },
      {
        file: 'Empty.rosz', // Create a Terminator (sub unit), its weapon should be automatically enabled.
        roster: null,
        // export: "./test/bsexport/wh40k/TS_duplicity_ca2022_v1_2022.txt",
        print: false,
        actions: [
          'Savage Orc Boar Boyz/+',
          'Savage Orc Boar Boyz/-',
          'Goblin Spear Chukka/+',
          'Goblin Spear Chukka/-',
          'Goblin Wolf Riders/+',
          'Goblin Wolf Riders/-',
          'Forest Goblin Spider Riders/+',
          'Forest Goblin Spider Riders/-',
          'Arachnarok Spider/+',
          'Arachnarok Spider/-',
          'Night Goblin Squig Gobba/+',
          'Night Goblin Squig Gobba/-',
        ],
        exportSettings: { asText: true, format: 'NR', includeConstants: true },
        export: `
        Orcs & Goblins - rrrrr
        ## Standard
      `,
      },
    ],
  },
]
