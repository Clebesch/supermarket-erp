import { Request, Response } from "express";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../services/customer.service.js";

export async function createCustomerController(
  request: Request,
  response: Response,
) {
  try {
    const customer = await createCustomer(request.body);

    return response.status(201).json(customer);
  } catch (error) {
    throw error;
  }
}

export async function getCustomersController(
  request: Request,
  response: Response,
) {
  try {
    const customers = await getCustomers();

    return response.json(customers);
  } catch (error) {
    throw error;
  }
}

export async function getCustomerByIdController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID do cliente inválido.",
      });
    }

    const customer = await getCustomerById(id);

    if (!customer) {
      return response.status(404).json({
        message: "Cliente não encontrado.",
      });
    }

    return response.json(customer);
  } catch (error) {
    throw error;
  }
}

export async function updateCustomerController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID do cliente inválido.",
      });
    }

    const customerExists = await getCustomerById(id);

    if (!customerExists) {
      return response.status(404).json({
        message: "Cliente não encontrado.",
      });
    }

    const customer = await updateCustomer(id, request.body);

    return response.json(customer);
  } catch (error) {
    throw error;
  }
}

export async function deleteCustomerController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID do cliente inválido.",
      });
    }

    const customerExists = await getCustomerById(id);

    if (!customerExists) {
      return response.status(404).json({
        message: "Cliente não encontrado.",
      });
    }

    await deleteCustomer(id);

    return response.status(204).send();
  } catch (error) {
    throw error;
  }
}