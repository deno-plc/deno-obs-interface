## EventSubscription

### EventSubscription::None

Subcription value used to disable all events.

- Identifier Value: `0`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::General

Subscription value to receive events in the `General` category.

- Identifier Value: `(1 << 0)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::Config

Subscription value to receive events in the `Config` category.

- Identifier Value: `(1 << 1)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::Scenes

Subscription value to receive events in the `Scenes` category.

- Identifier Value: `(1 << 2)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::Inputs

Subscription value to receive events in the `Inputs` category.

- Identifier Value: `(1 << 3)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::Transitions

Subscription value to receive events in the `Transitions` category.

- Identifier Value: `(1 << 4)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::Filters

Subscription value to receive events in the `Filters` category.

- Identifier Value: `(1 << 5)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::Outputs

Subscription value to receive events in the `Outputs` category.

- Identifier Value: `(1 << 6)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::SceneItems

Subscription value to receive events in the `SceneItems` category.

- Identifier Value: `(1 << 7)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::MediaInputs

Subscription value to receive events in the `MediaInputs` category.

- Identifier Value: `(1 << 8)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::Vendors

Subscription value to receive the `VendorEvent` event.

- Identifier Value: `(1 << 9)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::Ui

Subscription value to receive events in the `Ui` category.

- Identifier Value: `(1 << 10)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::All

Helper to receive all non-high-volume events.

- Identifier Value: `(General | Config | Scenes | Inputs | Transitions | Filters | Outputs | SceneItems | MediaInputs | Vendors | Ui)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::InputVolumeMeters

Subscription value to receive the `InputVolumeMeters` high-volume event.

- Identifier Value: `(1 << 16)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::InputActiveStateChanged

Subscription value to receive the `InputActiveStateChanged` high-volume event.

- Identifier Value: `(1 << 17)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::InputShowStateChanged

Subscription value to receive the `InputShowStateChanged` high-volume event.

- Identifier Value: `(1 << 18)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0

---

### EventSubscription::SceneItemTransformChanged

Subscription value to receive the `SceneItemTransformChanged` high-volume event.

- Identifier Value: `(1 << 19)`
- Latest Supported RPC Version: `1`
- Added in v5.0.0