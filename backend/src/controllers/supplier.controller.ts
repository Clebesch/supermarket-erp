import { Request, Response } from "express";

import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../services/supplier.service.js";

export async function createSupplierController(
  request: Request,
  response: Response,
) {
  try {
    const supplier = await createSupplier(request.body);

    return response.status(201).json(supplier);
  } catch (error) {
    throw error;
  }
}

export async function getSuppliersController(
  request: Request,
  response: Response,
) {
  try {
    const suppliers = await getSuppliers();

    return response.json(suppliers);
  } catch (error) {
    throw error;
  }
}

export async function getSupplierByIdController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID do fornecedor inválido.",
      });
    }

    const supplier = await getSupplierById(id);

    if (!supplier) {
      return response.status(404).json({
        message: "Fornecedor não encontrado.",
      });
    }

    return response.json(supplier);
  } catch (error) {
    throw error;
  }
}

export async function updateSupplierController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID do fornecedor inválido.",
      });
    }

    const supplierExists = await getSupplierById(id);

    if (!supplierExists) {
      return response.status(404).json({
        message: "Fornecedor não encontrado.",
      });
    }

    const supplier = await updateSupplier(id, request.body);

    return response.json(supplier);
  } catch (error) {
    throw error;
  }
}

export async function deleteSupplierController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID do fornecedor inválido.",
      });
    }

    const supplierExists = await getSupplierById(id);

    if (!supplierExists) {
      return response.status(404).json({
        message: "Fornecedor não encontrado.",
      });
    }

    await deleteSupplier(id);

    return response.status(204).send();
  } catch (error) {
    throw error;
  }
}