declare type Scene = import("../../scene").Scene;
declare type NodeMaterialBlock = import("./nodeMaterialBlock").NodeMaterialBlock;

/**
 * Enum defining the type of properties that can be edited in the property pages in the NME
 */
export enum PropertyTypeForEdition {
    /** property is a boolean */
    Boolean,
    /** property is a float */
    Float,
    /** property is a int */
    Int,
    /** property is a Vector2 */
    Vector2,
    /** property is a list of values */
    List,
}

/**
 * Interface that defines an option in a variable of type list
 */
export interface IEditablePropertyListOption {
    /** label of the option */
    label: string;
    /** value of the option */
    value: number;
}

/**
 * Interface that defines the options available for an editable property
 */
export interface IEditablePropertyOption {
    /** min value */
    min?: number;
    /** max value */
    max?: number;
    /** notifiers: indicates which actions to take when the property is changed */
    notifiers?: {
        /** the material should be rebuilt */
        rebuild?: boolean;
        /** the preview should be updated */
        update?: boolean;
        /** the onPreviewCommandActivated observer of the preview manager should be triggered */
        activatePreviewCommand?: boolean;
        /** a callback to trigger */
        callback?: (scene: Scene, block: NodeMaterialBlock) => boolean | undefined | void;
        /** a callback to validate the property. Returns true if the property is ok, else false. If false, the rebuild/update/callback events won't be called */
        onValidation?: (block: NodeMaterialBlock, propertyName: string) => boolean;
    };
    /** list of the options for a variable of type list */
    options?: IEditablePropertyListOption[];
}

/**
 * Interface that describes an editable property
 */
export interface IPropertyDescriptionForEdition {
    /** name of the property */
    propertyName: string;
    /** display name of the property */
    displayName: string;
    /** type of the property */
    type: PropertyTypeForEdition;
    /** group of the property - all properties with the same group value will be displayed in a specific section */
    groupName: string;
    /** options for the property */
    options: IEditablePropertyOption;
}

/**
 * Decorator that flags a property in a node material block as being editable
 * @param displayName
 * @param propertyType
 * @param groupName
 * @param options
 */
export function editableInPropertyPage(
    displayName: string,
    propertyType: PropertyTypeForEdition = PropertyTypeForEdition.Boolean,
    groupName: string = "PROPERTIES",
    options?: IEditablePropertyOption
) {
    return (target: any, propertyKey: string) => {
        let propStore: IPropertyDescriptionForEdition[] = target._propStore;
        if (!propStore) {
            propStore = [];
            target._propStore = propStore;
        }
        propStore.push({
            propertyName: propertyKey,
            displayName: displayName,
            type: propertyType,
            groupName: groupName,
            options: options ?? {},
        });
    };
}
