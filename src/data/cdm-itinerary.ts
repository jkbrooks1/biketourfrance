// GENERATED FILE - DO NOT EDIT BY HAND.
// Written by scripts/copy/generate-ts.mjs from tab "CDM_Itinerary_for_BTF_Site" of the Google workbook
// "BTF_Approved_Site_Copy". The workbook is the source of truth. Each value below maps to a tab,
// row and header in copy/cdm-itinerary-trace.json.

export interface ItineraryHighlight {
  name: string;
  note: string;
}

export interface ItineraryDay {
  id: string;
  kind: 'ride' | 'rest';
  row: number;
  startTown: string;
  endTown: string;
  distance?: string; // value as the Sheet gives it; unit text is itinerary.distanceUnit
  elevation?: string; // value as the Sheet gives it; unit text is itinerary.elevationUnit
  lodging?: string;
  highlights: ItineraryHighlight[];
  description: string;
}

export const ITINERARY: {
  tab: string;
  heading: string;
  detailsControl: string;
  restDayTitle: string;
  lodgingLabel: string;
  distanceUnit: string;
  elevationUnit: string;
  columnHeaders: { route: string; distance: string; sights: string };
  days: ItineraryDay[];
} = {
  "tab": "CDM_Itinerary_for_BTF_Site",
  "heading": "The tour day by day",
  "detailsControl": "View day details",
  "restDayTitle": "Toulouse · Two nights and a rest day",
  "lodgingLabel": "Where we'll stay",
  "distanceUnit": "mi",
  "elevationUnit": "ft",
  "columnHeaders": {
    "route": "Route",
    "distance": "Distance / Elevation",
    "sights": "Sights"
  },
  "days": [
    {
      "id": "1",
      "kind": "ride",
      "row": 2,
      "startTown": "Bordeaux",
      "endTown": "Meilhan-sur-Garonne",
      "distance": "53.6",
      "elevation": "2122",
      "lodging": "We are welcomed to the \"Maison d'Hôtes\" (B&B that serves dinner) by Pascale and Giles. Lovely farm estate in the midst of vineyards and agricultural land. The comfortable estate includes some rooms with private baths and others with shared bathrooms. We will have a lovely meal on the terrace near the pool. Riders are encouraged to bring a swim suit so they can enjoy the pool.",
      "highlights": [
        {
          "name": "Roger Lapébie Greenway",
          "note": "a former railway named for the 1937 Tour de France winner."
        },
        {
          "name": "La Sauve-Majeure Abbey",
          "note": "Romanesque ruins on the UNESCO pilgrimage routes; optional detour."
        }
      ],
      "description": "Leave Bordeaux on the Roger Lapébie cycle path through Créon and Sauveterre-de-Guyenne. Cross vineyards toward La Réole, join the Canal de Garonne at Fontet, and enjoy Meilhan-sur-Garonne’s sweeping valley views."
    },
    {
      "id": "2",
      "kind": "ride",
      "row": 3,
      "startTown": "Meilhan-sur-Garonne",
      "endTown": "Agen",
      "distance": "49.6",
      "elevation": "600",
      "lodging": "We are in a modernized family run three-star hotel that has been run by the same family for generations. Expect a comfortable stay and an incredibly warm welcome.",
      "highlights": [
        {
          "name": "Canal de Garonne",
          "note": "historic locks and bridges along the former freight towpath."
        },
        {
          "name": "Le Mas-d’Agenais",
          "note": "Rembrandt’s Christ on the Cross in the village church."
        }
      ],
      "description": "Follow the Canal de Garonne greenway past locks, quiet villages and rural scenery. Pass Damazan and Buzet-sur-Baïse before crossing the canal bridge over the Garonne to reach Agen’s historic centre."
    },
    {
      "id": "3",
      "kind": "ride",
      "row": 4,
      "startTown": "Agen",
      "endTown": "Moissac",
      "distance": "30.4",
      "elevation": "100",
      "lodging": "Sitting along the Garonne river we will find ourselves in a lovely modern three-star hotel with terrific storage and beautiful river views.",
      "highlights": [
        {
          "name": "Agen Canal-Bridge",
          "note": "ride beside the canal high above the Garonne on stone arches."
        },
        {
          "name": "Moissac Abbey",
          "note": "UNESCO-listed Romanesque portal and sculpted cloister."
        }
      ],
      "description": "Ride a flat, paved canal greenway through Lot-et-Garonne orchards, crossing Agen’s canal bridge. Follow the towpath toward the Tarn, with some coarser sections near Moissac’s port and its Romanesque cloisters."
    },
    {
      "id": "4",
      "kind": "ride",
      "row": 5,
      "startTown": "Moissac",
      "endTown": "Toulouse",
      "distance": "44.8",
      "elevation": "70",
      "lodging": "We'll end our day in central Toulouse in a lovely 3-star hotel run by an incredibly welcoming team and very comfortable rooms",
      "highlights": [
        {
          "name": "Pont-Canal du Cacor",
          "note": "a brick and stone canal bridge across the Tarn."
        },
        {
          "name": "Toulouse, the Pink City",
          "note": "terracotta streets and historic churches; first of two nights."
        }
      ],
      "description": "Cross the Cacor canal bridge and continue toward Montech’s water slope. Follow smooth canal greenways and dedicated urban cycle tracks into Toulouse, finishing where three canals meet at Ponts-Jumeaux junction."
    },
    {
      "id": "REST",
      "kind": "rest",
      "row": 6,
      "startTown": "Toulouse",
      "endTown": "Toulouse",
      "highlights": [
        {
          "name": "Place du Capitole",
          "note": "Toulouse’s grand city square with its Occitan cross."
        },
        {
          "name": "Saint-Sernin Basilica",
          "note": "a Romanesque pilgrimage church with an altar consecrated in 1096."
        }
      ],
      "description": "Spend a full rest day in Toulouse between two nights in the city. Explore Place du Capitole and Saint-Sernin Basilica at your own pace, with no scheduled ride or transfer."
    },
    {
      "id": "5",
      "kind": "ride",
      "row": 7,
      "startTown": "Toulouse",
      "endTown": "Castelnaudary",
      "distance": "39.9",
      "elevation": "731",
      "lodging": "Our day ends at a very comfortable and tidy family run two-star hotel. Cassoulet diner in the hotel restaurant that has been making the dish for more than 100 years is an option that shouldn't be missed.",
      "highlights": [
        {
          "name": "Canal du Midi",
          "note": "UNESCO-listed waterway with historic locks, bridges and changing tree cover."
        },
        {
          "name": "Grand Bassin, Castelnaudary",
          "note": "the broad canal port that hosted the canal’s opening in 1681."
        }
      ],
      "description": "Leave Toulouse along the Canal du Midi, following paved greenways toward the Seuil de Naurouze watershed. Expect gravel and older asphalt sections, with uneven surfaces and root damage on towpaths."
    },
    {
      "id": "6",
      "kind": "ride",
      "row": 8,
      "startTown": "Castelnaudary",
      "endTown": "Carcassonne",
      "distance": "23.9",
      "elevation": "266",
      "lodging": "We stay in a lovely, comfortable two-star hotel 300m from the gates to the walled city of Carcassonne.",
      "highlights": [
        {
          "name": "Lauragais farmland",
          "note": "canal views across the region’s cereal plains."
        },
        {
          "name": "Carcassonne’s Cité",
          "note": "two rings of medieval walls shaped by centuries of building and restoration."
        }
      ],
      "description": "Follow the Canal du Midi on earth and gravel towpaths, passing Bram’s port, historic locks and the Fresquel aqueducts. Ride toward Carcassonne on narrow tracks with roots and uneven ground."
    },
    {
      "id": "7",
      "kind": "ride",
      "row": 9,
      "startTown": "Carcassonne",
      "endTown": "Tourouzelle",
      "distance": "28.7",
      "elevation": "453",
      "lodging": "We end our day at the lovely \"Maison d'Hôtes\" of British ex-pats Wendy & Simon. Expect a lovely dinner and a chance to learn first hand what it's like to live in a small town in rural southwest France as an Anglophone.",
      "highlights": [
        {
          "name": "Canal at Carcassonne",
          "note": "the city gained its own canal port when the new line opened in 1810."
        },
        {
          "name": "Argens-Minervois",
          "note": "the start of the canal’s longest lock-free reach."
        }
      ],
      "description": "Ride through the Minervois on dirt and gravel towpaths beside the Canal du Midi. Pass locks and aqueducts near Trèbes, then take quiet paved roads through vineyards to reach Tourouzelle."
    },
    {
      "id": "8",
      "kind": "ride",
      "row": 10,
      "startTown": "Tourouzelle",
      "endTown": "Capestang",
      "distance": "26.4",
      "elevation": "670",
      "lodging": "We meet our hostess in her lovely 17th century manor house next to the town hall and 100m from the town's famous (almost) cathedral!",
      "highlights": [
        {
          "name": "Minervois",
          "note": "wine country between the Montagne Noire foothills and the canal."
        },
        {
          "name": "Le Somail",
          "note": "a historic canal port with its bridge, inn, chapel and ice house."
        }
      ],
      "description": "Follow the Canal du Midi through Homps and Le Somail toward Capestang. Expect narrow dirt and stone towpaths, tree roots and historic bridges, with Capestang’s great church rising above vineyards."
    },
    {
      "id": "9",
      "kind": "ride",
      "row": 11,
      "startTown": "Capestang",
      "endTown": "Sète",
      "distance": "44.5",
      "elevation": "400",
      "lodging": "Our voyage ends at a lovely, family run two-star hotel along the canals of Sète. Expect comfortable and well air conditioned rooms with convenient access to all sites and services.",
      "highlights": [
        {
          "name": "Étang de Thau",
          "note": "a vast coastal lagoon known for oyster farming."
        },
        {
          "name": "Sète Harbor",
          "note": "the fishing and trading port founded as the canal’s Mediterranean outlet."
        }
      ],
      "description": "Pass Malpas Tunnel and Fonserannes locks before joining paved greenways east of Béziers. Continue through Portiragnes and Agde, then follow the coastal Lido cycleway between lagoon and sea to Sète."
    }
  ]
};
