export type ApiArticulo = {
    id_articulo: number | null;
    articulo: string | null;
    imagen: string | null;
    existencia: number | null;
    precio: number | null;
    costo: number | null;
    existencia_texto: string | null;
};

export type InventoryItem = {
    id: number;
    name: string;
    image: string | null;
    units: number;
    price: number;
    cost: number;
    benefit: number;
    stockText: string;
};

const API_BASE =
    "https://softecard.com/borrar.php?t=Articulo_Lista_Select&consulta=";

function toNumber(value: unknown, fallback = 0): number {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
}

function toText(value: unknown, fallback = ""): string {
    return typeof value === "string" ? value : fallback;
}

function normalizeImage(imageValue: unknown): string | null {
    if (typeof imageValue !== "string") return null;
    const trimmed = imageValue.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }

    return null;
}

export function mapArticulo(raw: any): InventoryItem | null {
    if (!raw || typeof raw !== "object") return null;

    const id = toNumber(raw.id_articulo, 0);
    const name = toText(raw.articulo, "").trim();

    if (!id || !name) {
        return null;
    }

    const units = toNumber(raw.existencia, 0);
    const price = toNumber(raw.precio, 0);
    const cost = toNumber(raw.costo, 0);

    return {
        id,
        name,
        image: normalizeImage(raw.imagen),
        units,
        price,
        cost,
        benefit: price - cost,
        stockText: toText(raw.existencia_texto, `Existencia: ${units}`),
    };
}

export async function searchInventory(query: string): Promise<InventoryItem[]> {
    const encoded = encodeURIComponent(query.trim());
    const url = `${API_BASE}${encoded}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data !== "object" || !Array.isArray(data.articulos)) {
        throw new Error("La respuesta de la API no tiene el formato esperado.");
    }

    return data.articulos
        .map(mapArticulo)
        .filter((item: InventoryItem | null): item is InventoryItem => item !== null);
}

export function buildInventorySummary(items: InventoryItem[]) {
    return items.reduce(
        (acc, item) => {
            acc.totalPrice += item.price;
            acc.totalCost += item.cost;
            acc.totalUnits += item.units;
            acc.totalBenefit += item.benefit;
            return acc;
        },
        {
            totalPrice: 0,
            totalCost: 0,
            totalUnits: 0,
            totalBenefit: 0,
        },
    );
}