"""
Map constants for Wasteland Warfare game.
Defines continents and their territory distributions.
"""

CONTINENTS = {
    "Eurasia": {
        "bonus": 5,
        "territory_ids": list(range(1, 13))  # Territories 1-12
    },
    "Americhe": {
        "bonus": 4,
        "territory_ids": list(range(13, 22))  # Territories 13-21
    },
    "Afarik": {
        "bonus": 3,
        "territory_ids": list(range(22, 28))  # Territories 22-27
    },
    "Aurora": {
        "bonus": 2,
        "territory_ids": list(range(28, 35))  # Territories 28-34
    },
    "Neksis": {
        "bonus": 3,
        "territory_ids": list(range(35, 44))  # Territories 35-43
    }
}

# Adjacency list for territories (each territory connects to 2-3 neighbors)
ADJACENCY = {
    1: [2, 3, 4],
    2: [1, 5, 6],
    3: [1, 7, 8],
    4: [1, 9, 10],
    5: [2, 11, 12],
    6: [2, 13, 14],
    7: [3, 15, 16],
    8: [3, 17, 18],
    9: [4, 19, 20],
    10: [4, 21, 22],
    11: [5, 23, 24],
    12: [5, 25, 26],
    13: [6, 27, 28],
    14: [6, 29, 30],
    15: [7, 31, 32],
    16: [7, 33, 34],
    17: [8, 35, 36],
    18: [8, 37, 38],
    19: [9, 39, 40],
    20: [9, 41, 42],
    21: [10, 43],
    22: [10],
    23: [11],
    24: [11],
    25: [12],
    26: [12],
    27: [13],
    28: [13],
    29: [14],
    30: [14],
    31: [15],
    32: [15],
    33: [16],
    34: [16],
    35: [17],
    36: [17],
    37: [18],
    38: [18],
    39: [19],
    40: [19],
    41: [20],
    42: [20],
    43: [21]
}

# Verify all 43 territories are covered
all_territories = []
for continent in CONTINENTS.values():
    all_territories.extend(continent["territory_ids"])

assert len(all_territories) == 43, f"Expected 43 territories, got {len(all_territories)}"
assert set(all_territories) == set(range(1, 44)), "Territory IDs must be exactly 1-43"
