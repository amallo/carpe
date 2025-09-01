import { Logger } from '../../../logger/providers/logger.interface';
import { PeerError } from '../peer.provider';

/**
 * Handles BLE error mapping and logging
 */
export class BLEErrorHandler {
  constructor(private logger?: Logger) {}

  /**
   * Map BLE native errors to PeerError enum
   */
  mapError(error: any): Error {
    const errorMessage = error.message || error.toString();
    this.logger?.error('BLE-ERROR-HANDLER', `Mapping error: ${errorMessage}`);

    // Peer not found errors
    if (this.isErrorType(errorMessage, ['not found', 'device not found'])) {
      return new Error(PeerError.PEER_NOT_FOUND);
    }

    // Connection timeout errors
    if (this.isErrorType(errorMessage, ['timeout', 'connection timeout'])) {
      return new Error(PeerError.CONNECTION_TIMEOUT);
    }

    // Already connected errors
    if (this.isErrorType(errorMessage, ['already connected', 'connection exists'])) {
      return new Error(PeerError.PEER_ALREADY_CONNECTED);
    }

    // Not connectable errors
    if (this.isErrorType(errorMessage, ['not connectable', 'cannot connect'])) {
      return new Error(PeerError.PEER_NOT_CONNECTABLE);
    }

    // Authentication errors
    if (this.isErrorType(errorMessage, ['authentication', 'auth failed'])) {
      return new Error(PeerError.AUTHENTICATION_FAILED);
    }

    // Security/PIN errors
    if (this.isErrorType(errorMessage, ['security', 'pin', 'pairing'])) {
      return new Error(PeerError.SECURITY_REQUIRED);
    }

    // Bluetooth disabled errors
    if (this.isErrorType(errorMessage, ['bluetooth', 'disabled', 'not enabled'])) {
      return new Error(PeerError.BLUETOOTH_DISABLED);
    }

    // Permission errors
    if (this.isErrorType(errorMessage, ['permission', 'unauthorized'])) {
      return new Error(PeerError.PERMISSION_DENIED);
    }

    // Scan in progress errors
    if (this.isErrorType(errorMessage, ['scan in progress', 'scanning'])) {
      return new Error(PeerError.SCAN_IN_PROGRESS);
    }

    // Airplane mode errors
    if (this.isErrorType(errorMessage, ['airplane', 'flight mode'])) {
      return new Error(PeerError.DEVICE_IN_AIRPLANE_MODE);
    }

    // Resource errors
    if (this.isErrorType(errorMessage, ['resource', 'insufficient'])) {
      return new Error(PeerError.INSUFFICIENT_RESOURCES);
    }

    // LoRa specific errors
    if (this.isErrorType(errorMessage, ['frequency', 'lora frequency'])) {
      return new Error(PeerError.LORA_FREQUENCY_NOT_ALLOWED);
    }

    if (this.isErrorType(errorMessage, ['power', 'transmission power'])) {
      return new Error(PeerError.LORA_POWER_EXCEEDED);
    }

    if (this.isErrorType(errorMessage, ['interference', 'lora interference'])) {
      return new Error(PeerError.INTERFERENCE_DETECTED);
    }

    // Generic connection failed for unmatched errors
    this.logger?.warn('BLE-ERROR-HANDLER', `Unmapped error, using generic CONNECTION_FAILED: ${errorMessage}`);
    return new Error(PeerError.CONNECTION_FAILED);
  }

  /**
   * Check if error message contains any of the specified keywords
   */
  private isErrorType(errorMessage: string, keywords: string[]): boolean {
    const lowerMessage = errorMessage.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
  }

  /**
   * Log error with context information
   */
  logError(operation: string, peerId: string, error: any): void {
    this.logger?.error('BLE-ERROR-HANDLER', `${operation} failed for ${peerId}: ${error.message || error}`);
  }

  /**
   * Create a detailed error for debugging
   */
  createDetailedError(operation: string, peerId: string, originalError: any): Error {
    const message = `BLE ${operation} failed for device ${peerId}: ${originalError.message || originalError}`;
    this.logger?.error('BLE-ERROR-HANDLER', message);
    
    const mappedError = this.mapError(originalError);
    mappedError.message = `${mappedError.message} (${operation}: ${peerId})`;
    
    return mappedError;
  }
}
