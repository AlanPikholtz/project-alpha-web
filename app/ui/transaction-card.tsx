import React, { Fragment, useMemo, useState } from "react";
import { Transaction } from "../lib/transactions/types";
import { Client } from "../lib/clients/types";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";

export default function TransactionCard({
  transaction,
  clients,
}: {
  transaction: Partial<Transaction>;
  clients: Client[];
}) {
  const { createdAt, amount, type, clientId } = transaction;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const client = useMemo(() => {
    return (
      clients.find((x) => x.id === clientId)?.name || "Cliente no encontrado"
    );
  }, [clientId, clients]);

  const handleUserAssignment = () => {};

  return (
    <>
      <div className="border flex flex-col items-start gap-y-4 rounded border-black/20 shadow p-4">
        <div>
          <p>Fecha: {createdAt}</p>
          <p>Monto: ${amount}</p>
          <p>Tipo: {type}</p>
        </div>

        {!clientId ? (
          <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
            Asignar cliente
          </button>
        ) : (
          <p>Cliente: {client}</p>
        )}
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Payment successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
