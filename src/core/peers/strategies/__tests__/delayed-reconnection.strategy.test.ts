import { DelayedReconnectionStrategy } from '../delayed-reconnection.strategy';
import { PairedPeerEntity } from '../../store/paired-peer.slice';
import { ReconnectionContext } from '../reconnection.strategy';
import { FakeDateProvider } from '../../../common/date/providers/infra/fake-date.provider';

/**
 * @jest-environment node
 */
describe('DelayedReconnectionStrategy', () => {
  let strategy: DelayedReconnectionStrategy;
  let dateProvider: FakeDateProvider;

  beforeEach(() => {
    dateProvider = new FakeDateProvider();
    strategy = new DelayedReconnectionStrategy(dateProvider);
  });

  describe('shouldReconnect', () => {
    const createDisconnectedPeer = (lastConnectionTime?: string): PairedPeerEntity => ({
      id: 'test-peer',
      status: 'disconnected',
      connectionAttempts: 0,
      lastConnectionTime,
    });

    const createContext = (overrides: Partial<ReconnectionContext> = {}): ReconnectionContext => ({
      connectionAttempts: 0,
      ...overrides,
    });

    it('should return true for disconnected peer with no previous attempts and enough time passed', () => {
      const threeSecondsAgo = '2024-01-15T10:30:42.000Z'; // 3 seconds before current time
      const currentTime = '2024-01-15T10:30:45.000Z';
      
      dateProvider.willGenerateNow(currentTime);
      const peer = createDisconnectedPeer(threeSecondsAgo);
      const context = createContext({
        connectionAttempts: 0,
      });

      const result = strategy.shouldReconnect(peer, context);

      expect(result).toBe(true);
    });

    it('should return false for connected peer', () => {
      const peer: PairedPeerEntity = {
        id: 'test-peer',
        status: 'connected',
        connectionAttempts: 1,
        lastConnectionTime: '2024-01-15T10:30:44.000Z',
      };
      const context = createContext();

      const result = strategy.shouldReconnect(peer, context);

      expect(result).toBe(false);
    });

    it('should return false for pending peer', () => {
      const peer: PairedPeerEntity = {
        id: 'test-peer',
        status: 'pending',
        connectionAttempts: 1,
        lastConnectionTime: '2024-01-15T10:30:44.000Z',
      };
      const context = createContext();

      const result = strategy.shouldReconnect(peer, context);

      expect(result).toBe(false);
    });

    it('should return false when maximum attempts reached', () => {
      const threeSecondsAgo = '2024-01-15T10:30:42.000Z'; // 3 seconds before current time
      const currentTime = '2024-01-15T10:30:45.000Z';
      
      dateProvider.willGenerateNow(currentTime);
      const peer = createDisconnectedPeer(threeSecondsAgo);
      const context = createContext({
        connectionAttempts: 5, // Max attempts reached
      });

      const result = strategy.shouldReconnect(peer, context);

      expect(result).toBe(false);
    });

    it('should return false when not enough time has passed', () => {
      const oneSecondAgo = '2024-01-15T10:30:44.000Z'; // 1 second before current time
      const currentTime = '2024-01-15T10:30:45.000Z';
      
      dateProvider.willGenerateNow(currentTime);
      const peer = createDisconnectedPeer(oneSecondAgo);
      const context = createContext({
        connectionAttempts: 1,
      });

      const result = strategy.shouldReconnect(peer, context);

      expect(result).toBe(false);
    });

    it('should return true when exactly at delay threshold', () => {
      const twoSecondsAgo = '2024-01-15T10:30:43.000Z'; // Exactly 2 seconds before current time
      const currentTime = '2024-01-15T10:30:45.000Z';
      
      dateProvider.willGenerateNow(currentTime);
      const peer = createDisconnectedPeer(twoSecondsAgo);
      const context = createContext({
        connectionAttempts: 1,
      });

      const result = strategy.shouldReconnect(peer, context);

      expect(result).toBe(true);
    });

    it('should return true for attempts within limit', () => {
      const threeSecondsAgo = '2024-01-15T10:30:42.000Z'; // 3 seconds before current time
      const currentTime = '2024-01-15T10:30:45.000Z';
      
      dateProvider.willGenerateNow(currentTime);
      const peer = createDisconnectedPeer(threeSecondsAgo);
      const context = createContext({
        connectionAttempts: 3, // Within limit (max is 5)
      });

      const result = strategy.shouldReconnect(peer, context);

      expect(result).toBe(true);
    });

    it('should return false when exactly at max attempts', () => {
      const threeSecondsAgo = '2024-01-15T10:30:42.000Z'; // 3 seconds before current time
      const currentTime = '2024-01-15T10:30:45.000Z';
      
      dateProvider.willGenerateNow(currentTime);
      const peer = createDisconnectedPeer(threeSecondsAgo);
      const context = createContext({
        connectionAttempts: 5, // Exactly at max attempts
      });

      const result = strategy.shouldReconnect(peer, context);

      expect(result).toBe(false);
    });
  });

  describe('getDelayMs', () => {
    it('should return 2000 milliseconds', () => {
      const delay = strategy.getDelayMs();

      expect(delay).toBe(2000);
    });
  });

  describe('getMaxAttempts', () => {
    it('should return 5 attempts', () => {
      const maxAttempts = strategy.getMaxAttempts();

      expect(maxAttempts).toBe(5);
    });
  });
});
