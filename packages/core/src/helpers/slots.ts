import { types } from '@babel/core';
import { babelTransformExpression } from './babel-transform';

const SLOT_PREFIX = 'slot';
export type SlotMapper = (slotName: string) => string;

export const isSlotProperty = (key: string): boolean => key.startsWith(SLOT_PREFIX);

export const stripSlotPrefix = (key: string): string =>
  isSlotProperty(key) ? key.substring(SLOT_PREFIX.length) : key;

export function replaceSlotsInString(code: string, mapper: SlotMapper) {
  return babelTransformExpression(code, {
    Identifier(path: babel.NodePath<babel.types.Identifier>) {
      const name = path.node.name;
      const isSlot = isSlotProperty(name);
      if (isSlot) {
        path.replaceWith(types.identifier(mapper(stripSlotPrefix(name).toLowerCase())));
      }
    },
  });
}
