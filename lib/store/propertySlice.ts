import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  images: string[];
  thumbnail: string;
}

interface PriceRange {
  min: number;
  max: number;
}

export interface PropertyState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  priceRange: PriceRange;
  sortBy: "default" | "price-asc" | "price-desc";
  favorites: number[];
  visibleCount: number;
  showFavoritesOnly: boolean;
}

const initialState: PropertyState = {
  items: [],
  status: "idle",
  error: null,
  searchQuery: "",
  selectedCategory: "all",
  priceRange: { min: 0, max: 2500 },
  sortBy: "default",
  favorites: [],
  visibleCount: 10,
  showFavoritesOnly: false,
};

export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=100");
      if (!response.ok) {
        throw new Error("Failed to fetch properties from server");
      }
      const data = await response.json();
      return data.products as Product[];
    } catch (err: any) {
      return rejectWithValue(
        err.message || "An error occurred while fetching properties",
      );
    }
  },
);

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.visibleCount = 10;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.visibleCount = 10;
    },
    setPriceRange: (state, action: PayloadAction<PriceRange>) => {
      state.priceRange = action.payload;
      state.visibleCount = 10;
    },
    setSortBy: (
      state,
      action: PayloadAction<"default" | "price-asc" | "price-desc">,
    ) => {
      state.sortBy = action.payload;
      state.visibleCount = 10;
    },
    setShowFavoritesOnly: (state, action: PayloadAction<boolean>) => {
      state.showFavoritesOnly = action.payload;
      state.visibleCount = 10;
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.favorites.indexOf(id);
      if (index === -1) {
        state.favorites.push(id);
      } else {
        state.favorites.splice(index, 1);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
      }
    },
    loadFavorites: (state) => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("favorites");
          if (stored) {
            state.favorites = JSON.parse(stored);
          }
        } catch (e) {}
      }
    },
    incrementVisibleCount: (state) => {
      state.visibleCount += 10;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        if (action.payload.length > 0) {
          const prices = action.payload.map((p) => p.price);
          const maxPrice = Math.ceil(Math.max(...prices));
          state.priceRange.max = maxPrice;
        }
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Could not fetch properties";
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setPriceRange,
  setSortBy,
  setShowFavoritesOnly,
  toggleFavorite,
  loadFavorites,
  incrementVisibleCount,
} = propertySlice.actions;

export default propertySlice.reducer;
