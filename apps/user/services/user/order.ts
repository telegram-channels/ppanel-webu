// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** Checkout order POST /v1/public/order/checkout */
export async function checkoutOrder(
  body: API.CheckoutOrderRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.CheckoutOrderResponse }>('/v1/public/order/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Close order POST /v1/public/order/close */
export async function closeOrder(body: API.CloseOrderRequest, options?: { [key: string]: any }) {
  return request<API.Response & { data?: any }>('/v1/public/order/close', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Get order GET /v1/public/order/detail */
export async function queryOrderDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryOrderDetailParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.OrderDetails }>('/v1/public/order/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get order list GET /v1/public/order/list */
export async function queryOrderList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryOrderListParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.QueryOrderListResponse }>('/v1/public/order/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Pre create order POST /v1/public/order/pre */
export async function preCreateOrder(
  body: API.PurchaseOrderRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.PreOrderResponse }>('/v1/public/order/pre', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** purchase Subscription POST /v1/public/order/purchase */
export async function purchase(body: API.PurchaseOrderRequest, options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.PurchaseOrderResponse }>('/v1/public/order/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /v1/public/order/recharge */
export async function recharge(body: API.RechargeOrderRequest, options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.RechargeOrderResponse }>('/v1/public/order/recharge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Renewal Subscription POST /v1/public/order/renewal */
export async function renewal(body: API.RenewalOrderRequest, options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.RenewalOrderResponse }>('/v1/public/order/renewal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Reset traffic POST /v1/public/order/reset */
export async function resetTraffic(
  body: API.ResetTrafficOrderRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ResetTrafficOrderResponse }>(
    '/v1/public/order/reset',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}
