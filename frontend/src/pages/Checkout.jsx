import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const [formData, setFormData] = useState({
    billingFirstName: '',
    billingLastName: '',
    billingCompany: '',
    billingEmail: '',
    billingPhone: '',
    billingCountry: '',
    billingAddress1: '',
    billingPostcode: '',
    billingCity: '',
    orderComments: '',
    createAccount: false,
    paymentMethod: 'bacs'
  })

  const [showLogin, setShowLogin] = useState(false)
  const [showCoupon, setShowCoupon] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Checkout submitted:', formData)
    alert('Order placed successfully! In production, this would connect to your payment gateway.')
  }

  return (
    <div className="travel_tour-checkout travel_tour-page">
      {/* Breadcrumb */}
      <div className="top_site_main" style={{backgroundImage: 'url(/assets/img/banner/top-heading.jpg)'}}>
        <div className="banner-wrapper container article_heading">
          <div className="breadcrumbs-wrapper">
            <ul className="phys-breadcrumb">
              <li><Link to="/" className="home">Home</Link></li>
              <li>Checkout</li>
            </ul>
          </div>
          <h1 className="heading_primary">Checkout</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="content-area">
        <div className="container">
          <div className="row">
            <div className="site-main col-sm-12">
              <div className="entry-content">
                <div className="travel_tour">
                  {/* Login & Coupon Links */}
                  <div className="travel_tour-info-login-form">
                    <div className="travel_tour-info">
                      Returning customer?
                      <a href="#" className="showlogin" onClick={(e) => { e.preventDefault(); setShowLogin(!showLogin); }}>
                        Click here to login
                      </a>
                    </div>
                  </div>
                  <div className="travel_tour-info-coupon-message">
                    <div className="travel_tour-info">
                      Have a coupon?
                      <a href="#" className="showcoupon" onClick={(e) => { e.preventDefault(); setShowCoupon(!showCoupon); }}>
                        Click here to enter your code
                      </a>
                    </div>
                  </div>

                  {/* Checkout Form */}
                  <form onSubmit={handleSubmit} className="checkout travel_tour-checkout">
                    <div className="row">
                      {/* Left Column - Billing Details */}
                      <div className="col-md-7 columns">
                        <div className="col2-set" id="customer_details">
                          <div className="col-1">
                            <div className="travel_tour-billing-fields">
                              <h3>Billing Details</h3>
                              <div className="row">
                                <div className="col-sm-6">
                                  <p className="form-row form-row validate-required">
                                    <label htmlFor="billing_first_name">
                                      First Name <abbr className="required" title="required">*</abbr>
                                    </label>
                                    <input
                                      type="text"
                                      className="input-text"
                                      name="billingFirstName"
                                      id="billing_first_name"
                                      value={formData.billingFirstName}
                                      onChange={handleChange}
                                      required
                                    />
                                  </p>
                                </div>
                                <div className="col-sm-6">
                                  <p className="form-row form-row validate-required">
                                    <label htmlFor="billing_last_name">
                                      Last Name <abbr className="required" title="required">*</abbr>
                                    </label>
                                    <input
                                      type="text"
                                      className="input-text"
                                      name="billingLastName"
                                      id="billing_last_name"
                                      value={formData.billingLastName}
                                      onChange={handleChange}
                                      required
                                    />
                                  </p>
                                </div>
                              </div>
                              
                              <p className="form-row form-row-wide">
                                <label htmlFor="billing_company">Company Name</label>
                                <input
                                  type="text"
                                  className="input-text"
                                  name="billingCompany"
                                  id="billing_company"
                                  value={formData.billingCompany}
                                  onChange={handleChange}
                                />
                              </p>
                              
                              <div className="row">
                                <div className="col-sm-6">
                                  <p className="form-row form-row validate-required validate-email">
                                    <label htmlFor="billing_email">
                                      Email Address <abbr className="required" title="required">*</abbr>
                                    </label>
                                    <input
                                      type="email"
                                      className="input-text"
                                      name="billingEmail"
                                      id="billing_email"
                                      value={formData.billingEmail}
                                      onChange={handleChange}
                                      required
                                    />
                                  </p>
                                </div>
                                <div className="col-sm-6">
                                  <p className="form-row form-row validate-required validate-phone">
                                    <label htmlFor="billing_phone">
                                      Phone <abbr className="required" title="required">*</abbr>
                                    </label>
                                    <input
                                      type="tel"
                                      className="input-text"
                                      name="billingPhone"
                                      id="billing_phone"
                                      value={formData.billingPhone}
                                      onChange={handleChange}
                                      required
                                    />
                                  </p>
                                </div>
                              </div>
                              
                              <p className="form-row form-row-wide address-field validate-required">
                                <label htmlFor="billing_country">
                                  Country <abbr className="required" title="required">*</abbr>
                                </label>
                                <select
                                  name="billingCountry"
                                  id="billing_country"
                                  className="country_to_state country_select"
                                  value={formData.billingCountry}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="">Select a country…</option>
                                  <option value="KE">Kenya</option>
                                  <option value="US">United States</option>
                                  <option value="GB">United Kingdom</option>
                                  <option value="CA">Canada</option>
                                  <option value="AU">Australia</option>
                                  <option value="DE">Germany</option>
                                  <option value="FR">France</option>
                                  <option value="JP">Japan</option>
                                  <option value="BR">Brazil</option>
                                  <option value="ZA">South Africa</option>
                                </select>
                              </p>
                              
                              <p className="form-row form-row-wide address-field validate-required">
                                <label htmlFor="billing_address_1">
                                  Address <abbr className="required" title="required">*</abbr>
                                </label>
                                <input
                                  type="text"
                                  className="input-text"
                                  name="billingAddress1"
                                  id="billing_address_1"
                                  placeholder="Street address"
                                  value={formData.billingAddress1}
                                  onChange={handleChange}
                                  required
                                />
                              </p>
                              
                              <div className="row">
                                <div className="col-sm-6">
                                  <p className="form-row form-row validate-postcode">
                                    <label htmlFor="billing_postcode">Postcode / ZIP</label>
                                    <input
                                      type="text"
                                      className="input-text"
                                      name="billingPostcode"
                                      id="billing_postcode"
                                      value={formData.billingPostcode}
                                      onChange={handleChange}
                                    />
                                  </p>
                                </div>
                                <div className="col-sm-6">
                                  <p className="form-row form-row validate-required">
                                    <label htmlFor="billing_city">
                                      Town / City <abbr className="required" title="required">*</abbr>
                                    </label>
                                    <input
                                      type="text"
                                      className="input-text"
                                      name="billingCity"
                                      id="billing_city"
                                      value={formData.billingCity}
                                      onChange={handleChange}
                                      required
                                    />
                                  </p>
                                </div>
                              </div>
                              
                              <p className="form-row form-row-wide create-account">
                                <input
                                  type="checkbox"
                                  className="input-checkbox"
                                  id="createaccount"
                                  name="createAccount"
                                  checked={formData.createAccount}
                                  onChange={handleChange}
                                />
                                <label htmlFor="createaccount" className="checkbox">Create an account?</label>
                              </p>
                            </div>
                          </div>
                          
                          {/* Right Column - Additional Info */}
                          <div className="col-2">
                            <div className="travel_tour-shipping-fields">
                              <h3>Additional Information</h3>
                              <p className="form-row form-row notes">
                                <label htmlFor="order_comments">Order Notes</label>
                                <textarea
                                  name="orderComments"
                                  className="input-text"
                                  id="order_comments"
                                  placeholder="Notes about your order, e.g. special notes for delivery."
                                  rows="2"
                                  cols="5"
                                  value={formData.orderComments}
                                  onChange={handleChange}
                                ></textarea>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column - Order Summary */}
                      <div className="col-md-5 columns">
                        <div className="order-wrapper">
                          <h3 id="order_review_heading">Your order</h3>
                          <div id="order_review" className="travel_tour-checkout-review-order">
                            <table className="shop_table travel_tour-checkout-review-order-table">
                              <thead>
                                <tr>
                                  <th className="product-name">Tour</th>
                                  <th className="product-total">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="cart_item">
                                  <td className="product-name">
                                    Discover Brazil&nbsp;
                                    <strong className="product-quantity">× 1</strong>
                                  </td>
                                  <td className="product-total">$93.00</td>
                                </tr>
                              </tbody>
                              <tfoot>
                                <tr className="cart-subtotal">
                                  <th>Subtotal</th>
                                  <td>$93.00</td>
                                </tr>
                                <tr className="order-total">
                                  <th>Total</th>
                                  <td><strong>$93.00</strong></td>
                                </tr>
                              </tfoot>
                            </table>
                            
                            {/* Payment Methods */}
                            <div id="payment" className="travel_tour-checkout-payment">
                              <ul className="wc_payment_methods payment_methods methods">
                                <li className="wc_payment_method payment_method_bacs">
                                  <input
                                    id="payment_method_bacs"
                                    type="radio"
                                    className="input-radio"
                                    name="paymentMethod"
                                    value="bacs"
                                    checked={formData.paymentMethod === 'bacs'}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="payment_method_bacs">Direct Bank Transfer</label>
                                </li>
                                <li className="wc_payment_method payment_method_cheque">
                                  <input
                                    id="payment_method_cheque"
                                    type="radio"
                                    className="input-radio"
                                    name="paymentMethod"
                                    value="cheque"
                                    checked={formData.paymentMethod === 'cheque'}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="payment_method_cheque">Check Payments</label>
                                </li>
                                <li className="wc_payment_method payment_method_cod">
                                  <input
                                    id="payment_method_cod"
                                    type="radio"
                                    className="input-radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={formData.paymentMethod === 'cod'}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="payment_method_cod">Cash on Delivery</label>
                                </li>
                              </ul>
                              
                              {/* Place Order Button */}
                              <div className="form-row place-order">
                                <input
                                  type="submit"
                                  className="button alt"
                                  name="travel_tour_checkout_place_order"
                                  id="place_order"
                                  value="Place order"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}