# TODO Refactor: PeerProvider → BluetoothProvider

## 🎯 Objective

Refactor the current `PeerProvider` abstraction to `BluetoothProvider` for better architecture and focus purely on Bluetooth connectivity.

## 📊 Analysis Summary

### Current Issues
- **Over-generic abstraction**: `PeerProvider` mixes Bluetooth and LoRa concepts
- **Type pollution**: `PeerFound` contains both BLE and LoRa properties
- **Unnecessary complexity**: Generic interface for single-purpose Bluetooth functionality
- **SRP violation**: Interface trying to handle multiple technologies when only Bluetooth is needed

### Benefits of Bluetooth Specialization
- ✅ **Bluetooth-focused interface**: Leverage Bluetooth-specific features (GATT, services, characteristics)
- ✅ **Simplified architecture**: No need for generic abstraction with single technology
- ✅ **Better type safety**: Pure Bluetooth types without LoRa pollution
- ✅ **Cleaner code**: Remove unnecessary abstractions and focus on actual requirements

## 🏗️ Proposed Architecture

```typescript
// Simplified Bluetooth-focused architecture
interface BluetoothDevice {
  id: string;
  name: string;
  // Pure Bluetooth properties
  rssi?: number;
  advertising?: any;
  manufacturerData?: string;
  serviceUUIDs?: string[];
  txPowerLevel?: number;
  isConnectable?: boolean;
  localName?: string;
  // Calculated properties
  distance?: number;
  signalStrength?: number;
  lastSeen?: Date;
}

interface BluetoothScanOptions {
  timeout?: number;
  serviceUUIDs?: string[];
  allowDuplicates?: boolean;
}

// Clean Bluetooth provider interface
interface BluetoothProvider {
  // Core functionality
  scan(options?: BluetoothScanOptions): Promise<void>;
  stopScan(): Promise<void>;
  connect(deviceId: string): Promise<void>;
  disconnect(deviceId: string): Promise<void>;
  
  // Bluetooth-specific methods
  discoverServices(deviceId: string): Promise<BluetoothService[]>;
  readCharacteristic(deviceId: string, serviceId: string, characteristicId: string): Promise<string>;
  writeCharacteristic(deviceId: string, serviceId: string, characteristicId: string, data: string): Promise<void>;
  
  // Event callbacks
  onDeviceFound(callback: (device: BluetoothDevice) => void): void;
  onDeviceConnected(callback: (deviceId: string) => void): void;
  onScanStarted(callback: () => void): void;
  onScanStopped(callback: () => void): void;
}
```

## 📋 Refactoring Tasks

### Phase 1: Core Types & Interfaces
- [ ] **Create BluetoothDevice type** - Replace mixed PeerFound with pure Bluetooth types
- [ ] **Design BluetoothProvider interface** - Specialized for Bluetooth functionality
- [ ] **Create BluetoothScanOptions type** - Specific scanning configuration
- [ ] **Remove LoRa-specific properties** - Clean up type pollution

### Phase 2: Implementation
- [ ] **Implement BluetoothProvider** - Migrate BLEPeerProvider to new interface
- [ ] **Create test implementations** - Update FakePeerProvider and InMemoryPeerProvider
- [ ] **Update provider factory** - Modify ProviderFactory.createPeerProvider()

### Phase 3: Use Cases Migration
- [ ] **Update scan-peers.usecase.ts** - Use BluetoothProvider instead of PeerProvider
- [ ] **Update pair-peer.usecase.ts** - Adapt to new provider interface
- [ ] **Update disconnect-paired-peer.usecase.ts** - Use specialized disconnect method
- [ ] **Update unpair-peer.usecase.ts** - Adapt to new provider structure

### Phase 4: Dependencies & Store
- [ ] **Update Dependencies interface** - Change peerProvider to bluetoothProvider
- [ ] **Update store configuration** - Adapt Redux store setup
- [ ] **Update provider lifecycle** - Modify useProviderLifecycle hook
- [ ] **Update factory methods** - Rename createPeerProvider to createBluetoothProvider

### Phase 5: Cleanup & Documentation
- [ ] **Remove old PeerProvider** - Clean up legacy interface
- [ ] **Update type exports** - Clean up type definitions
- [ ] **Update documentation** - Reflect new architecture in comments
- [ ] **Add architecture notes** - Document the design decisions

## 🧪 Testing Strategy

### Unit Tests
- [ ] Test BluetoothProvider implementations
- [ ] Test use cases with new provider interface
- [ ] Test provider factory with new types

### Integration Tests
- [ ] Test Bluetooth scanning flow
- [ ] Test device connection flow
- [ ] Test provider lifecycle management

### Compatibility Tests
- [ ] Ensure no functional regression
- [ ] Verify all existing features work
- [ ] Test with both mock and real providers

## 🚨 Migration Notes

### Breaking Changes
- **None** - This should be a transparent refactoring
- All existing functionality must continue to work
- API contracts remain the same from UI perspective

### Risk Mitigation
- Implement in parallel with existing code
- Gradual migration of use cases
- Extensive testing before removing old code
- Feature flags if needed during transition

## 📅 Timeline

### Prerequisites
- [ ] Stabilize current Bluetooth functionality
- [ ] Complete any pending Bluetooth features
- [ ] Ensure test coverage is adequate

### Execution
- **Estimated effort**: 2-3 days
- **Best timing**: When ready to clean up technical debt
- **Prerequisite**: Stable Bluetooth features

### Post-Refactoring
- Clean Bluetooth-focused architecture
- Removed unnecessary abstractions
- Better maintainability and type safety

## 🎯 Success Criteria

- [ ] All existing Bluetooth functionality works unchanged
- [ ] Clean Bluetooth-specific types and interfaces
- [ ] No regression in app behavior
- [ ] Code is more maintainable and focused
- [ ] Removed unnecessary abstractions and complexity
- [ ] Tests pass and coverage is maintained

## 📚 References

- Architecture rules: Follow hexagonal architecture principles
- Naming conventions: Use `BluetoothProvider` suffix
- TypeScript: Maintain strict typing throughout
- Testing: Use test providers for mocking

---

**Priority**: Medium (Technical Debt)
**Impact**: High (Architecture Quality)
**Effort**: Medium (2-3 days)
**Dependencies**: None (can be done independently)
