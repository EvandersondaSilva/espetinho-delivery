interface RawComboGroupCategory {
    category: {
        id: string;
        name: string;
    };
}

interface RawComboGroupFixedItem {
    quantity: number;
    product: Record<string, unknown>;
}

interface RawComboGroup {
    categories: RawComboGroupCategory[];
    fixedItems: RawComboGroupFixedItem[];
    [key: string]: unknown;
}

interface RawCombo {
    groups: RawComboGroup[];
    [key: string]: unknown;
}

// Achata group.categories de [{ category: { id, name } }] para [{ id, name }] e
// group.fixedItems de [{ product: {...}, quantity }] para [{ ...produto, quantity }] —
// os joins com combo_group_categories/combo_group_fixed_items ficam transparentes
// pro cliente da API.
function formatComboGroup<T extends RawComboGroup>(group: T) {
    return {
        ...group,
        categories: group.categories.map((entry) => entry.category),
        fixedItems: group.fixedItems.map((entry) => ({ ...entry.product, quantity: entry.quantity })),
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
