export type EntityState<T> = {
    byId: Record<string, T>
    ids: string[]
}

export type EntityAdapter<T extends { id: string }> = {
    addOne: (state: EntityState<T>, entity: T) => EntityState<T>;
    addMany: (state: EntityState<T>, entities: T[]) => EntityState<T>;
    removeOne: (state: EntityState<T>, id: string) => EntityState<T>;
    removeMany: (state: EntityState<T>, ids: string[]) => EntityState<T>;
    updateOne: (state: EntityState<T>, update: { id: string; changes: Partial<T> }) => EntityState<T>;
    setAll: (state: EntityState<T>, entities: T[]) => EntityState<T>;
    getInitialState: () => EntityState<T>;
}

export function createEntityAdapter<T extends { id: string }>(): EntityAdapter<T> {
    return {
        getInitialState: (): EntityState<T> => {
            return {
                byId: {},
                ids: [],
            };
        },

        addOne: (state: EntityState<T>, entity: T): EntityState<T> => {
            // Éviter les doublons
            if (state.ids.includes(entity.id)) {
                return state;
            }
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [entity.id]: entity,
                },
                ids: [...state.ids, entity.id],
            };
        },

        addMany: (state: EntityState<T>, entities: T[]): EntityState<T> => {
            const newById = { ...state.byId };
            const newIds = [...state.ids];

            entities.forEach(entity => {
                if (!newIds.includes(entity.id)) {
                    newById[entity.id] = entity;
                    newIds.push(entity.id);
                }
            });

            return {
                ...state,
                byId: newById,
                ids: newIds,
            };
        },

        removeOne: (state: EntityState<T>, id: string): EntityState<T> => {
            const newById = { ...state.byId };
            delete newById[id];

            return {
                ...state,
                byId: newById,
                ids: state.ids.filter(existingId => existingId !== id),
            };
        },

        removeMany: (state: EntityState<T>, ids: string[]): EntityState<T> => {
            const newById = { ...state.byId };
            ids.forEach(id => delete newById[id]);

            return {
                ...state,
                byId: newById,
                ids: state.ids.filter(existingId => !ids.includes(existingId)),
            };
        },

        updateOne: (state: EntityState<T>, update: { id: string; changes: Partial<T> }): EntityState<T> => {
            const existingEntity = state.byId[update.id];
            if (!existingEntity) {
                return state;
            }

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [update.id]: {
                        ...existingEntity,
                        ...update.changes,
                    },
                },
            };
        },

        setAll: (state: EntityState<T>, entities: T[]): EntityState<T> => {
            const newById: Record<string, T> = {};
            const newIds: string[] = [];

            entities.forEach(entity => {
                newById[entity.id] = entity;
                newIds.push(entity.id);
            });

            return {
                ...state,
                byId: newById,
                ids: newIds,
            };
        },
    };
}

export function getInitialEntityState<T>(): EntityState<T> {
    return {
        byId: {},
        ids: [],
    };
}
