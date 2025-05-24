import { createModel } from '@rematch/core';
import { RootModel } from '../../store/create-store';

type ActionState = {
	byId: Record<string, ActionEntity>
    ids: string[]
}

type CreateAction = {
    id: string;
    content: string;
    at: string;
}

type ActionEntity = {
    id: string;
    content: string;
    at: string;
}

export const createActionModel = ()=>{
    const actionModel = createModel<RootModel>()({
        state: {
            byId: {} as Record<string, ActionEntity>,
            ids: [] as string[],
        } as ActionState,
        reducers: {
            add: (state, payload: CreateAction) => {
              return {
                ...state,
                byId: {
                    ...state.byId,
                    [payload.id]: {id: payload.id, content: payload.content, at: payload.at},
                },
                ids: [...state.ids, payload.id],
              };
            },
          },
        effects: () => ({
            async createAction(payload: CreateAction) {
              this.add(payload);
              return Promise.resolve();
            },
        }),
    });
    return actionModel;
};
