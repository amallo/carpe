import { createStore } from '../../../store/create-store';

describe('FEATURE: Audie connects to a BLE device', () => {
    test('Scan peers and found device carpe-001', async ()=>{
        const store = createStore();
        await store.dispatch.peer.scan();
        expect(store.getState()).toEqual({
            peer: {
                byId: {
                    ['dev0'] : {
                        id: 'dev0',
                        name: 'carpe-001',
                    },
                },
                ids:['dev0'],
            },
        });
    });
});


