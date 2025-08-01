'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiProduct } from '@/types/product';
import AddToCart from '../components/AddToCart';
import { useRouter } from 'next/navigation';
import { useGetProducts } from '@/hooks/useGetProducts';

interface Props {
  params: {
    id: string;
  };
}

const ProductPage = ({ params }: Props) => {
  const { id } = params;
  const router = useRouter();
  const { products, isLoading, error } = useGetProducts();

  useEffect(() => {
    if (!isLoading && !error && products) {
      const productExists = products.some((product: ApiProduct) => product.id === parseInt(id));
      if (!productExists) {
        router.push('/productos');
      }
    }
  }, [isLoading, error, products, id, router]);

  if (isLoading) {
    return (
      <main className="container mx-auto pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
          <Skeleton className="w-full h-96" />
          <div className="space-y-4">
            <Skeleton className="w-full h-5" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
            </div>
            <Skeleton className="w-full h-5" />
            <div className="space-y-2">
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !products) {
    return (
      <main className="container mx-auto pt-32">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error al cargar el producto</h1>
          <p className="text-gray-600 mt-2">Por favor, intenta de nuevo más tarde</p>
        </div>
      </main>
    );
  }

  const dataProduct = products.find((product: ApiProduct) => product.id === parseInt(id));

  if (!dataProduct) {
    return null;
  }

  const discount = dataProduct.price - dataProduct.discount;

  return (
    <main className="container mx-auto pt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
        <div className="relative aspect-square">
          <Image
            src={dataProduct.image}
            alt={dataProduct.title}
            width={500}
            height={500}
            className="object-contain w-full h-full"
            priority
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{dataProduct.title}</h1>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold">${discount}</p>
            <p className="text-xl text-gray-600 line-through">${dataProduct.price}</p>
            <p className="text-red-400 text-xl font-bold bg-red-100 p-1 rounded-md">
              - {dataProduct.discount}%
            </p>
          </div>
          <p className="text-gray-600">{dataProduct.description}</p>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Marca:</span> {dataProduct.brand}
            </p>
            <p>
              <span className="font-semibold">Modelo:</span> {dataProduct.model}
            </p>
            <p>
              <span className="font-semibold">Color:</span> {dataProduct.color}
            </p>
            <p>
              <span className="font-semibold">Categoría:</span> {dataProduct.category}
            </p>
          </div>
          <AddToCart product={dataProduct} />
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
