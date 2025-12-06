import type { Schema, Attribute } from '@strapi/strapi';

export interface OrderOrderItem extends Schema.Component {
  collectionName: 'components_order_order_items';
  info: {
    displayName: 'Order Item';
    icon: 'shopping-cart';
    description: 'Individual item in an order';
  };
  attributes: {
    product: Attribute.Relation<
      'order.order-item',
      'oneToOne',
      'api::product.product'
    >;
    quantity: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    unitPrice: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    totalPrice: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    size: Attribute.String;
    color: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'order.order-item': OrderOrderItem;
    }
  }
}
