/**
 * @license GPL-3.0-or-later
 * Deno OBS Interface
 *
 * Copyright (C) 2025 Felix Beckh
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * A list of all event subscriptions that are currently supported by the OBS WebSocket API.
 * This list is not exhaustive and may change in the future as new features are added to OBS.
 * The values are bitwise OR'd together to create a single number that can be used to subscribe to multiple events at once.
 */
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