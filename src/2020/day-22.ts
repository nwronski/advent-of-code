type Deck = number[];
type Player = [ number, Deck ];

function getCopy(players: Player[], lengths?: number[]): Player[] {
  return players.map(([ p, c ], i): Player => ([ p, c.slice(0, lengths?.[i]) ]));
}

function getScore(cards: number[]): number {
  return cards.reduce((prev, cur, i) => prev + (cur * (cards.length - i)), 0);
}

function game(players: Player[], recursive: boolean): [ number, number ] {
  const state = new Map<number, Deck>(players);
  const rounds = new Set<string>();

  while (![ ...state ].some(([ , c ]) => c.length === 0)) {
    const deckA = state.get(1)!;
    const deckB = state.get(2)!;

    let winner = 0;
    const round = [ ...state.values() ].join('|');
    if (recursive && rounds.has(round)) {
      return [ 1, getScore(deckA) ]; // player 1 wins
    }
    rounds.add(round);

    const cardA = deckA.shift()!;
    const cardB = deckB.shift()!;

    const currentCards = [ cardA, cardB ];
    if (recursive && deckA.length >= cardA && deckB.length >= cardB) {
      const subState = getCopy([ ...state ], currentCards);
      const [ subWinner ] = game(subState, recursive); // recursive
      winner = subWinner;
    } else {
      winner = cardA > cardB ? 1 : 2; // higher card wins
    }

    if (winner !== 1) { currentCards.reverse(); }
    state.get(winner)!.push(...currentCards);
  }

  const [ player, cards ] = [ ...state ].find(([ , c ]) => c.length > 0)!;
  return [ player, getScore(cards) ];
}

function play(players: Player[], recursive: boolean, print = false) {
  const [ winner, score ] = game(getCopy(players), recursive);
  if (print) {
    // eslint-disable-next-line no-console
    console.log(`player ${winner} wins (score: ${score})`);
  }
  return score;
}

/**
 * Day 22 (2020)
 * yarn start --year 2020 22
 * @see {@link https://adventofcode.com/2020/day/22}
 */
export function solution(contents: string) {
  const players = contents.split(/\n{2}/)
    .map((chunk) => {
      const [ player, ...cards ] = chunk.split(/\n/);
      const [ , playerNum ] = /(\d+):$/.exec(player)!;
      return [ parseInt(playerNum, 10), cards.map((c) => parseInt(c, 10)) ] as Player;
    });

  const part1 = play(players, false);
  const part2 = play(players, true);

  return { part1, part2 };
}
