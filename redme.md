# API Documentation

This API provides a variety of methods to interact with the platform. Below, you will find a list of available methods, including their parameters and types.

## Public Methods

* **symbols**: Returns a list of available symbols.
	+ Method: `v1/public/symbols`
	+ Type: `public`
* **ticker**: Returns information about a specific pair's ticker.
	+ Method: `v1/public/ticker`
	+ Type: `public`
	+ Parameters: `pair` (required)
* **orderbook**: Returns the order book for a specific pair.
	+ Method: `v1/public/book`
	+ Type: `public`
	+ Parameters: `pair` (required)
* **trades**: Returns a list of trades for a specific pair.
	+ Method: `v1/public/trades`
	+ Type: `public`
	+ Parameters: `pair` (required)

## Private Methods

* **balances-and-info**: Returns information about user accounts and balances.
	+ Method: `v1/private/balances`
	+ Type: `private`
	+ Parameters: `request_id` (required)
* **open-orders**: Returns information about user's open orders.
	+ Method: `v1/private/get-order`
	+ Type: `private`
	+ Parameters: `order_id` (required), `request_id` (required)
* **orders/new**: Creates a new order.
	+ Method: `v1/private/create-order`
	+ Type: `private`
	+ Parameters: `type_trade` (required), `type` (required), `rate` (required), `stop_rate` (required), `volume` (required), `pair` (required), `request_id` (required)
* **orders/active**: Returns information about user's active orders.
	+ Method: `v1/private/orders`
	+ Type: `private`
	+ Parameters: `request_id` (required)
* **orders/delete**: Cancels an order.
	+ Method: `v1/private/delete-order`
	+ Type: `private`
	+ Parameters: `request_id` (required), `order_id` (required)
* **orders/history**: Returns information about user's order history.
	+ Method: `v1/private/history`
	+ Type: `private`
	+ Parameters: `request_id` (required)
* **balances**: Returns information about user's balances.
	+ Method: `v1/private/balances`
	+ Type: `private`
	+ Parameters: `request_id` (required)
* **address**: Returns information about user's address.
	+ Method: `v1/private/get-address`
	+ Type: `private`
	+ Parameters: `iso` (required), `new` (required), `request_id` (required)
* **withdrawals/new**: Creates a new withdrawal.
	+ Method: `v1/withdraw`
	+ Type: `private`
	+ Parameters: `iso` (required), `amount` (required), `to_address` (required), `request_id` (required), `comment` (required), `fee_from_amount` (required)
* **user-transactions**: Returns information about user's transactions.
	+ Method: `v1/withdraw/confirm-code`
	+ Type: `private`
	+ Parameters: `id` (required), `request_id` (required), `google_pin` (required)
* **send-pin**: Sends a PIN to the user.
	+ Method: `v1/withdraw/send-pin`
	+ Type: `private`
	+ Parameters: `id` (required), `request_id` (required)