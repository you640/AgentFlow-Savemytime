import React from 'react';
import { Badge } from '../Badge';
import { AddToCartButton, AddToCartLabels } from '../AddToCartButton';
export interface ProductImage {
  url: string;
  altText?: string;
}
export interface StorefrontProductCard {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  badge?: string;
  featuredImage?: ProductImage;
  hoverImage?: ProductImage;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}
export interface ProductCardProps {
  product: StorefrontProductCard;
  onAddToCart?: (payload: {
    productId: string;
    quantity: number;
  }) => Promise<void> | void;
  labels?: AddToCartLabels;
}
export const ProductCard = ({
  product,
  onAddToCart,
  labels
}: ProductCardProps) => {
  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] bg-gm-bg-soft rounded-gm-md overflow-hidden mb-4">
        {product.badge &&
        <Badge label={product.badge} className="absolute top-3 left-3 z-10" />
        }

        <a
          href={`/produkty/${product.handle}`}
          className="absolute inset-0 z-0 gm-focus-ring"
          aria-label={product.title}>
          
          {product.featuredImage ?
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out group-hover:opacity-0" /> :


          <div className="w-full h-full bg-gm-border flex items-center justify-center">
              <span className="text-gm-text-muted text-sm">Bez obrázka</span>
            </div>
          }

          {product.hoverImage && product.featuredImage &&
          <img
            src={product.hoverImage.url}
            alt={`${product.title} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100" />

          }
        </a>

        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 flex justify-center z-20">
          <AddToCartButton
            productId={product.id}
            variant="quick-add"
            availableForSale={product.availableForSale}
            onAddToCart={onAddToCart}
            labels={labels} />
          
        </div>
      </div>

      <div className="flex flex-col items-center text-center px-2">
        <a
          href={`/produkty/${product.handle}`}
          className="font-heading text-lg text-gm-text mb-1 hover:text-gm-primary transition-colors gm-focus-ring">
          
          {product.title}
        </a>
        <p className="text-gm-text-muted text-sm">
          {product.priceRange.minVariantPrice.currencyCode}{' '}
          {product.priceRange.minVariantPrice.amount}
        </p>
      </div>
    </div>);

};