interface RawComboGroupCategory {
    category: {
        id: string;
        name: string;
    };
}

interface RawComboGroup {
    categories: RawComboGroupCategory[];
    [key: string]: unknown;
}

interface RawCombo {
    groups: RawComboGroup[];
    [key: string]: unknown;
}

// Achata group.categories de [{ category: { id, name } }] para [{ id, name }] —
// o join com combo_group_categories fica transparente pro cliente da API.
function formatComboGroup<T extends RawComboGroup>(group: T) {
    return {
        ...group,
        categories: group.categories.map((entry) => entry.category),
    };
}

function formatCombo<T extends RawCombo>(combo: T) {
    return {
        ...combo,
        groups: combo.groups.map((group) => formatComboGroup(group)),
    };
}

function formatCombos<T extends RawCombo>(combos: T[]) {
    return combos.map((combo) => formatCombo(combo));
}

export { formatCombo, formatCombos };
