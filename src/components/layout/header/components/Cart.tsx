'use client';
import React from 'react';
import { CartIcon } from '@/assets/icons';
import useToggle from '@/hooks/useToggle';
import { useCartStore } from '@/store/cart-store';
import { Button } from '../../../ui/button';
import CartCard from './CartCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog';
import { CartProduct } from '@/types/cart';
import { User } from '@/types/auth';
import useGetUser from '@/hooks/useGetUser';
import { userApi } from '@/lib/api/user';

const Cart = () => {
  const { user } = useGetUser();
  const { isOpen, toggle } = useToggle();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const { items, clearCart } = useCartStore();
  const totalItems = items.reduce((acc: number, item: CartProduct) => acc + (item.quantity || 0), 0);
  const totalPrice = items.reduce((acc: number, item: CartProduct) => acc + item.price * (item.quantity || 0), 0);

  const handleFinishPurchase = () => {
    try {
      // Crear nueva compra
      const nuevaCompra = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        products: items.map((item: CartProduct) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        total: totalPrice,
      };

      // Actualizar usuario con solo la nueva compra
      const updatedUser = {
        ...user,
        purchases: [nuevaCompra]
      };

      userApi.updateUser(updatedUser as User);

      // Limpiar carrito y mostrar confirmación
      setShowConfirmation(true);
      clearCart();
      setTimeout(() => {
        setShowConfirmation(false);
        toggle();
      }, 2000);
    } catch (error) {
      console.error('Error al procesar la compra:', error);
    }
  };

  return (
    <div>
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>¡Compra realizada con éxito!</DialogTitle>
            <DialogDescription>
              Gracias por tu compra. Recibirás un correo con los detalles.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Button data-testid="cart-button" variant="ghost" onClick={toggle}>
        {<CartIcon />}
        {totalItems > 0 && (
          <span className=" text-sm font-semibold text-violet-600">{totalItems}</span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-0 right-0 w-full h-screen bg-black/50 z-40" onClick={toggle}>
          <div
            className="bg-white absolute top-0 right-0 w-full lg:w-1/2 h-full p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-4">
              <h1 className="text-xl font-bold">Carrito de compras</h1>
              <Button variant="ghost" onClick={toggle} className="text-xl">
                ×
              </Button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-20rem)] border-b pb-4">
              {items.map((item: CartProduct) => (
                <CartCard key={item.id} product={item} />
              ))}
            </div>

            <div>
              <div className="flex flex-col gap-4 p-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="font-semibold">${totalPrice}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-500">Envío</p>
                  <p className="font-semibold">Gratis</p>
                </div>
              </div>

              <div className="flex justify-between p-4">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-lg font-semibold text-violet-600">${totalPrice}</p>
              </div>

              <Button
                variant="violet"
                className="w-full"
                onClick={handleFinishPurchase}
                disabled={items.length === 0}
              >
                Finalizar compra
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
