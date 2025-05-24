import { createStore } from '../../store/create-store';

describe('FEATURE: Audie creates an action', () => {
    it('has no action', async ()=>{
        const store = createStore();
        expect(store.getState()).toEqual({
            action: {
                byId: {},
                ids:[],
            },
        });
    });
    test('audie create an action into INBOX', async ()=>{
        const store = createStore();
        await store.dispatch.action.createAction({
            id: 'action0',
            content: 'acheter la semaine de 4h',
            at: '2025-05-01T00:00:00.000Z',
        });
        expect(store.getState()).toEqual({
            action: {
                byId: {
                    ['action0'] : {
                        id: 'action0',
                        content: 'acheter la semaine de 4h',
                        at: '2025-05-01T00:00:00.000Z',
                    },
                },
                ids:['action0'],
            },
        });
    });
});


