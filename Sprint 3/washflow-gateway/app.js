/**
 * NextGen WashFlow™ — Service Selection Gateway
 * Application Logic & State Management
 * 
 * Architecture: Single reactive class with centralized state,
 * declarative rendering, and event delegation.
 */

// ─── Data Mapping Configuration ──────────────────────────────────────────────

const PACKAGE_CONFIGS = [
  {
    title: 'Express Wash',
    basePrice: 12.99,
    isPromo: false,
    tier: 'basic',
    icon: '💧',
    features: ['Exterior foam wash', 'High-pressure rinse', 'Spot-free dry'],
  },
  {
    title: 'Premium Shine',
    basePrice: 24.99,
    isPromo: true,
    tier: 'premium',
    icon: '✨',
    features: ['Everything in Express', 'Triple foam polish', 'Wheel blast cleaning', 'Rain repellent coating'],
  },
  {
    title: 'Deluxe Detail',
    basePrice: 39.99,
    isPromo: false,
    tier: 'deluxe',
    icon: '👑',
    features: ['Everything in Premium', 'Ceramic shield coat', 'Interior vacuum', 'Dashboard wipe', 'Tire Shine included'],
  },
];

const UPSELL_CONFIGS = [
  {
    name: 'Tire Shine',
    addOnPrice: 5.00,
    requiresPackageType: null,
    icon: '🔆',
  },
  {
    name: 'Underbody Rinse',
    addOnPrice: 9.99,
    requiresPackageType: 'premium',
    icon: '🚿',
  },
];

const TAX_RATE = 0.085;

const API_PACKAGES_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=3&_start=0';
const API_UPSELLS_URL = 'https://jsonplaceholder.typicode.com/comments?_limit=2&_start=0';


// ─── WashFlowApp Class ──────────────────────────────────────────────────────

class WashFlowApp {
  constructor() {
    /** @type {{ selectedPackageId: string|null, selectedUpsellIds: Set<string>, packageData: Array, upsellData: Array, isLoading: boolean, error: string|null }} */
    this.state = {
      selectedPackageId: null,
      selectedUpsellIds: new Set(),
      packageData: [],
      upsellData: [],
      isLoading: true,
      error: null,
    };

    // Cache DOM references
    this.dom = {
      loadingState: document.getElementById('loading-state'),
      errorState: document.getElementById('error-state'),
      errorMessage: document.getElementById('error-message'),
      mainContent: document.getElementById('main-content'),
      packagesGrid: document.getElementById('packages-grid'),
      upsellsGrid: document.getElementById('upsells-grid'),
      summaryPackage: document.getElementById('summary-package'),
      summaryAddons: document.getElementById('summary-addons'),
      summarySubtotal: document.getElementById('summary-subtotal'),
      summaryTax: document.getElementById('summary-tax'),
      summaryTotal: document.getElementById('summary-total'),
      btnCheckout: document.getElementById('btn-checkout'),
      btnReset: document.getElementById('btn-reset'),
      btnResetMobile: document.getElementById('btn-reset-mobile'),
      btnRetry: document.getElementById('btn-retry'),
    };

    this._bindEvents();
    this.init();
  }


  // ─── Initialization ─────────────────────────────────────────────────────

  async init() {
    this.setState({ isLoading: true, error: null });
    await this._fetchData();
  }

  async _fetchData() {
    try {
      const [postsResponse, commentsResponse] = await Promise.all([
        fetch(API_PACKAGES_URL),
        fetch(API_UPSELLS_URL),
      ]);

      if (!postsResponse.ok || !commentsResponse.ok) {
        throw new Error(`API request failed (Status: ${postsResponse.status}/${commentsResponse.status})`);
      }

      const posts = await postsResponse.json();
      const comments = await commentsResponse.json();

      // Map posts to packages
      const packageData = posts.map((post, index) => {
        const config = PACKAGE_CONFIGS[index];
        return {
          id: String(post.id),
          title: config.title,
          description: post.body.replace(/\n/g, ' ').substring(0, 120),
          basePrice: config.basePrice,
          isPromo: config.isPromo,
          includesUpsellId: null, // Set after upsells are mapped
          tier: config.tier,
          icon: config.icon,
          features: config.features,
        };
      });

      // Map comments to upsells
      const upsellData = comments.map((comment, index) => {
        const config = UPSELL_CONFIGS[index];
        return {
          id: String(comment.id),
          name: config.name,
          description: comment.email,
          addOnPrice: config.addOnPrice,
          requiresPackageType: config.requiresPackageType,
          icon: config.icon,
        };
      });

      // Wire up dependency: Deluxe package includes Tire Shine
      const deluxePkg = packageData.find(p => p.tier === 'deluxe');
      const tireShineSvc = upsellData.find(u => u.name === 'Tire Shine');
      if (deluxePkg && tireShineSvc) {
        deluxePkg.includesUpsellId = tireShineSvc.id;
      }

      this.setState({
        packageData,
        upsellData,
        isLoading: false,
        error: null,
      });

    } catch (err) {
      console.error('WashFlow: Failed to fetch service data', err);
      this.setState({
        isLoading: false,
        error: err.message || 'An unexpected error occurred while loading services.',
      });
    }
  }


  // ─── State Management ───────────────────────────────────────────────────

  setState(updates) {
    // Merge updates into state
    for (const key of Object.keys(updates)) {
      this.state[key] = updates[key];
    }
    this.render();
  }


  // ─── Package Selection Handler ──────────────────────────────────────────

  handlePackageSelection(packageId) {
    const { packageData, upsellData } = this.state;
    const newSelectedUpsellIds = new Set(this.state.selectedUpsellIds);

    // Toggle: clicking the already-selected package deselects it
    const newSelectedPackageId =
      this.state.selectedPackageId === packageId ? null : packageId;

    const oldPackage = packageData.find(p => p.id === this.state.selectedPackageId);
    const newPackage = packageData.find(p => p.id === newSelectedPackageId);

    // Remove auto-included upsell from old package (if it was auto-included)
    if (oldPackage && oldPackage.includesUpsellId) {
      newSelectedUpsellIds.delete(oldPackage.includesUpsellId);
    }

    // Add auto-included upsell for new package
    if (newPackage && newPackage.includesUpsellId) {
      newSelectedUpsellIds.add(newPackage.includesUpsellId);
    }

    // Remove upsells whose dependencies are no longer met
    for (const upsellId of Array.from(newSelectedUpsellIds)) {
      const upsell = upsellData.find(u => u.id === upsellId);
      if (upsell && upsell.requiresPackageType) {
        const meetsRequirement = newPackage &&
          (newPackage.tier === 'premium' || newPackage.tier === 'deluxe');
        if (!meetsRequirement) {
          newSelectedUpsellIds.delete(upsellId);
        }
      }
    }

    this.setState({
      selectedPackageId: newSelectedPackageId,
      selectedUpsellIds: newSelectedUpsellIds,
    });
  }


  // ─── Upsell Toggle Handler ─────────────────────────────────────────────

  handleUpsellToggle(upsellId) {
    const { selectedPackageId, packageData, upsellData } = this.state;
    const upsell = upsellData.find(u => u.id === upsellId);
    const selectedPackage = packageData.find(p => p.id === selectedPackageId);

    if (!upsell) return;

    // Cannot toggle if auto-included by selected package
    if (selectedPackage && selectedPackage.includesUpsellId === upsellId) {
      return;
    }

    // Cannot toggle if dependency not met
    if (upsell.requiresPackageType) {
      const meetsRequirement = selectedPackage &&
        (selectedPackage.tier === 'premium' || selectedPackage.tier === 'deluxe');
      if (!meetsRequirement) return;
    }

    const newSelectedUpsellIds = new Set(this.state.selectedUpsellIds);
    if (newSelectedUpsellIds.has(upsellId)) {
      newSelectedUpsellIds.delete(upsellId);
    } else {
      newSelectedUpsellIds.add(upsellId);
    }

    this.setState({ selectedUpsellIds: newSelectedUpsellIds });
  }


  // ─── Dynamic Pricing Engine ─────────────────────────────────────────────

  calculateTotalPrice() {
    const { selectedPackageId, selectedUpsellIds, packageData, upsellData } = this.state;

    let subtotal = 0;

    // Base package price
    const selectedPackage = packageData.find(p => p.id === selectedPackageId);
    if (selectedPackage) {
      subtotal += selectedPackage.basePrice;
    }

    // Add-on prices (excluding those included by the package)
    for (const upsellId of selectedUpsellIds) {
      const upsell = upsellData.find(u => u.id === upsellId);
      if (upsell) {
        // Don't charge if auto-included by the selected package
        const isIncluded = selectedPackage && selectedPackage.includesUpsellId === upsellId;
        if (!isIncluded) {
          subtotal += upsell.addOnPrice;
        }
      }
    }

    return subtotal;
  }


  // ─── Reset Handler ──────────────────────────────────────────────────────

  handleReset() {
    this.setState({
      selectedPackageId: null,
      selectedUpsellIds: new Set(),
    });
  }


  // ─── Checkout Handler ───────────────────────────────────────────────────

  handleCheckout() {
    const { selectedPackageId, selectedUpsellIds, packageData, upsellData } = this.state;
    const selectedPackage = packageData.find(p => p.id === selectedPackageId);

    if (!selectedPackage) return;

    const subtotal = this.calculateTotalPrice();
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    const upsellNames = [];
    for (const upsellId of selectedUpsellIds) {
      const upsell = upsellData.find(u => u.id === upsellId);
      if (upsell) {
        const isIncluded = selectedPackage.includesUpsellId === upsellId;
        upsellNames.push(upsell.name + (isIncluded ? ' (Included)' : ''));
      }
    }

    const upsellStr = upsellNames.length > 0 ? upsellNames.join(', ') : 'None';
    const message = `Initiating checkout for: ${selectedPackage.title} + ${upsellStr}. Total: $${total.toFixed(2)}`;

    console.log(message);
    alert(message);
  }


  // ─── Event Binding ──────────────────────────────────────────────────────

  _bindEvents() {
    // Reset buttons
    this.dom.btnReset.addEventListener('click', () => this.handleReset());
    this.dom.btnResetMobile.addEventListener('click', () => this.handleReset());

    // Retry button
    this.dom.btnRetry.addEventListener('click', () => this.init());

    // Checkout button
    this.dom.btnCheckout.addEventListener('click', () => this.handleCheckout());

    // Event delegation for package cards
    this.dom.packagesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-package-id]');
      if (card) {
        this.handlePackageSelection(card.dataset.packageId);
      }
    });

    // Keyboard support for package cards
    this.dom.packagesGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('[data-package-id]');
        if (card) {
          e.preventDefault();
          this.handlePackageSelection(card.dataset.packageId);
        }
      }
    });

    // Event delegation for upsell cards
    this.dom.upsellsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-upsell-id]');
      if (card) {
        this.handleUpsellToggle(card.dataset.upsellId);
      }
    });

    // Keyboard support for upsell cards
    this.dom.upsellsGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('[data-upsell-id]');
        if (card) {
          e.preventDefault();
          this.handleUpsellToggle(card.dataset.upsellId);
        }
      }
    });
  }


  // ─── Rendering ──────────────────────────────────────────────────────────

  render() {
    const { isLoading, error } = this.state;

    // Toggle state overlays
    this.dom.loadingState.hidden = !isLoading;
    this.dom.errorState.hidden = !error;
    this.dom.mainContent.hidden = isLoading || !!error;

    if (isLoading) return;

    if (error) {
      this.dom.errorMessage.textContent = error;
      return;
    }

    this._renderPackages();
    this._renderUpsells();
    this._renderSummary();
  }


  _renderPackages() {
    const { packageData, selectedPackageId } = this.state;

    this.dom.packagesGrid.innerHTML = packageData.map(pkg => {
      const isSelected = pkg.id === selectedPackageId;
      const classes = [
        'package-card',
        isSelected ? 'package-card--selected' : '',
        pkg.isPromo ? 'package-card--promo' : '',
      ].filter(Boolean).join(' ');

      const priceParts = pkg.basePrice.toFixed(2).split('.');

      return `
        <div class="${classes}"
             data-package-id="${pkg.id}"
             role="radio"
             aria-checked="${isSelected}"
             aria-label="Select ${pkg.title} package for $${pkg.basePrice.toFixed(2)}"
             tabindex="0">

          <div class="package-card__selected-badge" aria-hidden="true">
            <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9l5-6" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Currently Selected
          </div>

          <div class="package-card__promo-badge" aria-label="Limited time promotional offer">
            <svg viewBox="0 0 14 14" fill="none"><path d="M7 1l1.8 3.6L13 5.2l-2.9 2.8.7 4-3.8-2-3.8 2 .7-4L1 5.2l4.2-.6L7 1z" fill="currentColor"/></svg>
            Limited Time Offer!
          </div>

          <div class="package-card__top-row">
            <div class="package-card__tier-icon package-card__tier-icon--${pkg.tier}" aria-hidden="true">
              ${pkg.icon}
            </div>
            <div class="package-card__info">
              <h3 class="package-card__name">${pkg.title}</h3>
              <p class="package-card__desc">${pkg.description}</p>
            </div>
          </div>

          <ul class="package-card__features" style="list-style:none;display:flex;flex-direction:column;gap:4px;margin:4px 0;">
            ${pkg.features.map(f => `
              <li style="display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--text-secondary);">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;"><path d="M2.5 6.5L5 9l5-6" stroke="var(--accent-green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                ${f}
              </li>
            `).join('')}
          </ul>

          <div class="package-card__price">
            <span class="package-card__price-currency">$</span>
            <span class="package-card__price-amount">${priceParts[0]}</span>
            <span class="package-card__price-cents">.${priceParts[1]}</span>
          </div>

          <button class="package-card__action-btn"
                  aria-label="${isSelected ? `Deselect ${pkg.title}` : `Select ${pkg.title}`}"
                  type="button">
            ${isSelected ? '✓ Current Selection' : 'Select Package'}
          </button>
        </div>
      `;
    }).join('');
  }


  _renderUpsells() {
    const { upsellData, selectedUpsellIds, selectedPackageId, packageData } = this.state;
    const selectedPackage = packageData.find(p => p.id === selectedPackageId);

    this.dom.upsellsGrid.innerHTML = upsellData.map(upsell => {
      const isSelected = selectedUpsellIds.has(upsell.id);
      const isIncluded = selectedPackage && selectedPackage.includesUpsellId === upsell.id;

      // Dependency check
      let isDependencyMet = true;
      if (upsell.requiresPackageType) {
        isDependencyMet = selectedPackage &&
          (selectedPackage.tier === 'premium' || selectedPackage.tier === 'deluxe');
      }
      const isDisabled = !isDependencyMet && !isIncluded;

      const classes = [
        'upsell-card',
        isIncluded ? 'upsell-card--included' : '',
        isSelected && !isIncluded ? 'upsell-card--selected' : '',
        isDisabled ? 'upsell-card--disabled' : '',
      ].filter(Boolean).join(' ');

      let toggleLabel;
      if (isIncluded) {
        toggleLabel = 'Included';
      } else if (isSelected) {
        toggleLabel = 'Remove';
      } else {
        toggleLabel = 'Add';
      }

      return `
        <div class="${classes}"
             data-upsell-id="${upsell.id}"
             role="checkbox"
             aria-checked="${isSelected || isIncluded}"
             aria-disabled="${isDisabled || isIncluded}"
             aria-label="${upsell.name} add-on for $${upsell.addOnPrice.toFixed(2)}${isIncluded ? ' (included with package)' : ''}${isDisabled ? ' (requires Premium or Deluxe package)' : ''}"
             tabindex="${isDisabled ? '-1' : '0'}">

          <div class="upsell-card__icon" aria-hidden="true">${upsell.icon}</div>

          <div class="upsell-card__content">
            <h3 class="upsell-card__name">${upsell.name}</h3>
            <p class="upsell-card__desc">${upsell.description}</p>
            <p class="upsell-card__dependency-text">⚠ Requires Premium or Deluxe Package</p>
            <p class="upsell-card__included-text">✓ Included with your package</p>
          </div>

          <div class="upsell-card__right">
            <span class="upsell-card__price">+$${upsell.addOnPrice.toFixed(2)}</span>
            <button class="upsell-card__toggle-btn" type="button"
                    aria-label="${toggleLabel} ${upsell.name}"
                    ${isDisabled ? 'disabled' : ''}>
              ${toggleLabel}
            </button>
            <span class="upsell-card__included-badge">Included</span>
          </div>
        </div>
      `;
    }).join('');
  }


  _renderSummary() {
    const { selectedPackageId, selectedUpsellIds, packageData, upsellData } = this.state;
    const selectedPackage = packageData.find(p => p.id === selectedPackageId);

    // Package line
    if (selectedPackage) {
      this.dom.summaryPackage.innerHTML = `
        <span class="summary-package-dot" aria-hidden="true"></span>
        <span>${selectedPackage.title} — $${selectedPackage.basePrice.toFixed(2)}</span>
      `;
    } else {
      this.dom.summaryPackage.innerHTML = `<span class="summary-empty">None Selected</span>`;
    }

    // Add-ons list
    if (selectedUpsellIds.size > 0) {
      let addonsHtml = '';
      for (const upsellId of selectedUpsellIds) {
        const upsell = upsellData.find(u => u.id === upsellId);
        if (!upsell) continue;
        const isIncluded = selectedPackage && selectedPackage.includesUpsellId === upsellId;
        addonsHtml += `
          <div class="summary-addon-item">
            <span class="summary-addon-item__name">
              <span class="summary-addon-dot" aria-hidden="true"></span>
              ${upsell.name}
              ${isIncluded ? '<span class="summary-addon-included-tag">Free</span>' : ''}
            </span>
            <span class="summary-addon-item__price">${isIncluded ? '$0.00' : '+$' + upsell.addOnPrice.toFixed(2)}</span>
          </div>
        `;
      }
      this.dom.summaryAddons.innerHTML = addonsHtml;
    } else {
      this.dom.summaryAddons.innerHTML = `<span class="summary-empty">No add-ons selected</span>`;
    }

    // Pricing
    const subtotal = this.calculateTotalPrice();
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    this.dom.summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    this.dom.summaryTax.textContent = `$${tax.toFixed(2)}`;
    this.dom.summaryTotal.textContent = `$${total.toFixed(2)}`;

    // Checkout button state
    this.dom.btnCheckout.disabled = !selectedPackageId;
    this.dom.btnCheckout.setAttribute('aria-label',
      selectedPackageId ? `Proceed to checkout — Total $${total.toFixed(2)}` : 'Select a package to proceed');
  }
}


// ─── Bootstrap ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  window.washFlowApp = new WashFlowApp();
});
