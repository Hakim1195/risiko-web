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

# Verify all 43 territories are covered
all_territories = []
for continent in CONTINENTS.values():
    all_territories.extend(continent["territory_ids"])

assert len(all_territories) == 43, f"Expected 43 territories, got {len(all_territories)}"
assert set(all_territories) == set(range(1, 44)), "Territory IDs must be exactly 1-43"
