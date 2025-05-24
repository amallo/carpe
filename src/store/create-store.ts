import { init, Models, RematchDispatch, RematchRootState } from '@rematch/core';
import { createActionModel } from '../core/store/actions.model';

export interface RootModel extends Models<RootModel> {
    action: ReturnType<typeof createActionModel>;
}

export const createStore = ()=>{
    const actionModel = createActionModel();
    const models: RootModel = { action: actionModel };

    const store = init({
        models,
    });
    return store;
};

export type Store = ReturnType<typeof createStore>
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
