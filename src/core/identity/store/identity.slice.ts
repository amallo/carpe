import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Identity } from '../entities/identity.entity';
import { createIdentity } from '../usecases/create-identity.usecase';

interface IdentityState {
    current: Identity | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: IdentityState = {
    current: null,
    isLoading: false,
    error: null,
};

const identitySlice = createSlice({
    name: 'identity',
    initialState,
    reducers: {
        clearCurrentIdentity: (state) => {
            state.current = null;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Pending - Démarrage du loading
            .addCase(createIdentity.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            // Fulfilled - Succès
            .addCase(createIdentity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.current = action.payload;
                state.error = null;
            })
            // Rejected - Erreur
            .addCase(createIdentity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create identity';
            });
    },
});

export const { clearCurrentIdentity, setError } = identitySlice.actions;
export default identitySlice.reducer;
