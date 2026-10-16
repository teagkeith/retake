import type { Player } from "../types/Player";

export const players: Player[] = [
    {
        id: 1,
        name: "Player Alpha",
        team: "Team Alpha",
        role: "Duelist",
        kills: 42,
        deaths: 29,
        assists: 18,
        fantasyPoints: 84.5
    },
     {
        id: 2,
        name: "Player Beta",
        team: "Team Beta",
        role: "Duelist",
        kills: 22,
        deaths: 15,
        assists: 24,
        fantasyPoints: 105
    },
     {
        id: 3,
        name: "Player Charlie",
        team: "Team Charlie",
        role: "Controller",
        kills: 2,
        deaths: 15,
        assists: 2,
        fantasyPoints: 4
    },
     {
        id: 4,
        name: "Player Delta",
        team: "Team Delta",
        role: "Initiator",
        kills: 19,
        deaths: 4,
        assists: 12,
        fantasyPoints: 90
    }
]