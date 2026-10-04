// Show results by year — the permanent record behind /history.
//
// This file is static on purpose: /history is a public page and must stay free of
// `src/firebase.js` (see CLAUDE.md), and Firestore's `events/<year>` is working data
// that is reset each rollover. Each year's winners are frozen here once, from the
// announced rows of `events/<year>/awards` (never staged ones) — see the "freeze the
// winners" step in docs/01-year-rollover.md.
//
// Shape of a year:
//   year        the show year
//   edition     the ordinal printed on that year's trophies ("21st") — not computed
//   tierLabel   what the ranked list was called that year. 2026 awarded a Top 50; the
//               2025 plaques read "TOP 30". Never assume the size from another year.
//   featured    the Best in Show trophies, in announcement order
//   top         the ranked list, 1st place first (list position IS the place)
//   note        optional one-liner shown under the year heading
//
// Owner names are exactly as announced. 2026 published full names (an organizer
// override of the usual first-name-plus-last-initial form), so those are kept as-is.
// A year with no entry here is simply not listed on the page — don't add a stub with
// guessed contents; add the year when its results are in hand.
// Newest first.
export const WINNERS = [
  {
    year: 2026,
    edition: '21st',
    tierLabel: 'Top 50',
    featured: [
      { title: 'Best in Show Car', carNumber: '322', vehicle: '1955 Chevrolet Bel Air', owner: 'David Yokely', photo: '/gallery/2026/bos-chevy-stage-t.webp' },
      { title: 'Best in Show Truck', carNumber: '129', vehicle: '1966 Ford F-100', owner: 'Daniel Cimmerer', photo: '/gallery/2026/bos-ford-pickup-t.webp' },
    ],
    top: [
      { carNumber: '402', vehicle: '1969 Chevrolet Nova', owner: 'Billy Peek' },
      { carNumber: '089', vehicle: '1970 Chevrolet Chevelle', owner: 'Emmett Collins' },
      { carNumber: '181', vehicle: '1968 Chevrolet C10', owner: 'Joe Oxford' },
      { carNumber: '396', vehicle: '1969 VW Beetle', owner: 'Joe Griffey' },
      { carNumber: '171', vehicle: '1965 Chevrolet Corvette', owner: 'Alan Woodall' },
      { carNumber: '163', vehicle: '1969 BMW 1600', owner: 'David Coffey' },
      { carNumber: '382', vehicle: '1969 AMC Scrambler', owner: 'Rick Hawkins' },
      { carNumber: '316', vehicle: '1956 Chevrolet 3100', owner: 'Adam Childers' },
      { carNumber: '296', vehicle: '1970 Chevrolet Chevelle', owner: 'Marty Gentry' },
      { carNumber: '194', vehicle: '1965 Chevrolet 210', owner: 'Robert Hancock' },
      { carNumber: '392', vehicle: '1961 Ford Falcon', owner: 'Andrew Barnes' },
      { carNumber: '399', vehicle: '1982 Toyota Land Cruiser', owner: 'Alex Henson' },
      { carNumber: '125', vehicle: '1972 Chevrolet Corvette', owner: 'Charles Jackson' },
      { carNumber: '167', vehicle: '1955 Chevrolet Bel Air', owner: 'Jerry Barker' },
      { carNumber: '547', vehicle: '1954 Packard', owner: 'Yashal Ilyayel' },
      { carNumber: '135', vehicle: '1952 Ford F1', owner: 'Gene King' },
      { carNumber: '051', vehicle: '1956 Porsche Speedster', owner: 'James Caevlora' },
      { carNumber: '137', vehicle: '1956 Chevrolet Wagon', owner: 'Bill Rollins' },
      { carNumber: '244', vehicle: '1955 Chevrolet Bel Air', owner: 'Randy Gibson' },
      { carNumber: '033', vehicle: '1991 Ford F-150', owner: 'Ernest Gillespie' },
      { carNumber: '361', vehicle: '1969 Chevrolet Camaro', owner: 'Roger Miller' },
      { carNumber: '040', vehicle: '1955 Chevrolet Bel Air', owner: 'Logan Williamson' },
      { carNumber: '231', vehicle: '1968 Chevrolet C10', owner: 'John Price' },
      { carNumber: '166', vehicle: '1971 Chevrolet C20', owner: 'Frank West' },
      { carNumber: '281', vehicle: '1933 Ford Coupe', owner: 'Donald Dobbs' },
      { carNumber: '145', vehicle: '1969 Dodge Charger', owner: 'Keith Mayfield' },
      { carNumber: '069', vehicle: '1979 Pontiac Trans Am', owner: 'Randy Davis' },
      { carNumber: '088', vehicle: '1969 Chevrolet Chevelle', owner: 'James Collins' },
      { carNumber: '133', vehicle: '1966 Ford F-100', owner: 'Nicki Barfield' },
      { carNumber: '326', vehicle: '1933 Ford Pickup', owner: 'Phil Weeks' },
      { carNumber: '510', vehicle: '1987 Buick Grand National', owner: 'Frank Lecouna' },
      { carNumber: '062', vehicle: '1971 VW Bus', owner: 'Alan Edwards' },
      { carNumber: '419', vehicle: '1959 VW Beetle', owner: 'Kelly Wood' },
      { carNumber: '605', vehicle: '1958 VW Beetle', owner: 'Marlin Smith' },
      { carNumber: '204', vehicle: '1969 Chevrolet Camaro', owner: 'Tom Duncan' },
      { carNumber: '169', vehicle: '1963 Ford Falcon', owner: 'Carol Case' },
      { carNumber: '389', vehicle: '1957 Isetta 300', owner: 'William Stroud' },
      { carNumber: '214', vehicle: '1986 GMC C10', owner: 'Don Schmid' },
      { carNumber: '268', vehicle: '1970 Chevrolet C10', owner: 'Brian Gosdin' },
      { carNumber: '084', vehicle: '1968 Chevrolet Nova', owner: 'Paul Corrao' },
      { carNumber: '251', vehicle: '1971 Chevrolet K10', owner: 'Patric Bodenmoler' },
      { carNumber: '038', vehicle: '1972 Chevrolet K5 Blazer', owner: 'Bret Gross' },
      { carNumber: '395', vehicle: '1973 Jensen-Healey', owner: 'Craig Wolfe' },
      { carNumber: '300', vehicle: '1966 Chevrolet Chevelle', owner: 'Jera Schumpert' },
      { carNumber: '337', vehicle: '1967 Chevrolet Nova', owner: 'Travis Lamay' },
      { carNumber: '292', vehicle: '1965 Chevrolet C10', owner: 'Alan Dorsey' },
      { carNumber: '085', vehicle: '1982 Chevrolet S10', owner: 'Brandy Hardee' },
      { carNumber: '276', vehicle: '1939 Packard', owner: 'Corey Ray' },
      { carNumber: '301', vehicle: '1978 Chevrolet Corvette', owner: 'Kelly Phillips' },
      { carNumber: '000', vehicle: '1973 Bronco', owner: 'Chris Millians' },
    ],
  },
]
