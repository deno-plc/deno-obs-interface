export const enum EventSubscriptions {
    // Subscription value to receive events in the `General` category.
    GENERAL = 1 << 0,

    // Subscription value to receive events in the `Config` category.
    CONFIG = 1 << 1,

    // Subscription value to receive events in the `Scenes` category.
    SCENES = 1 << 2,

    // Subscription value to receive events in the `Inputs` category.
    INPUTS = 1 << 3,

    // Subscription value to receive events in the `Transitions` category.
    TRANSITIONS = 1 << 4,

    // Subscription value to receive events in the `Filters` category.
    FILTERS = 1 << 5,

    // Subscription value to receive events in the `Outputs` category.
    OUTPUTS = 1 << 6,

    // Subscription value to receive events in the `SceneItems` category.
    SCENE_ITEMS = 1 << 7,

    // Subscription value to receive events in the `MediaInputs` category.
    MEDIA_INPUTS = 1 << 8,

    // Subscription value to receive the `VendorEvent` event.
    VENDORS = 1 << 9,

    // Subscription value to receive events in the `Ui` category.
    UI = 1 << 10,

    /**
     * Helper to receive all non-high-volume events.
     */
    ALL = GENERAL | CONFIG | SCENES | INPUTS | TRANSITIONS | FILTERS | OUTPUTS | SCENE_ITEMS | MEDIA_INPUTS | VENDORS | UI,

    // Subscription value to receive the `InputVolumeMeters` high-volume event.
    INPUT_VOLUME_METERS = 1 << 16,

    // Subscription value to receive the `InputActiveStateChanged` high-volume event.
    INPUT_ACTIVE_STATE_CHANGED = 1 << 17,

    // Subscription value to receive the `InputShowStateChanged` high-volume event.
    INPUT_SHOW_STATE_CHANGED = 1 << 18,

    // Subscription value to receive the `SceneItemTransformChanged` high-volume event.
    SCENE_ITEM_TRANSFORM_CHANGED = 1 << 19,
}