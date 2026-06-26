(function () {
  'use strict';

  const frequencies = {
    annually: 1,
    'semi-annually': 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  };

  function getInputs(container) {
    return {
      principal: parseFloat(container.querySelector('[data-input="principal"]')?.value) || 0,
      contribution: parseFloat(container.querySelector('[data-input="contribution"]')?.value) || 0,
      rate: parseFloat(container.querySelector('[data-input="rate"]')?.value) || 0,
      years: parseInt(container.querySelector('[data-input="years"]')?.value, 10) || 0,
      frequency: container.querySelector('[data-input="frequency"]')?.value || 'monthly',
    };
  }

  function calculate(data) {
    const principal = data.principal;
    const contribution = data.contribution;
    const annualRate = data.rate / 100;
    const years = data.years;
    const frequency = frequencies[data.frequency] || 12;

    const totalMonths = years * 12;
    const monthlyRate = Math.pow(1 + annualRate / frequency, frequency / 12) - 1;

    let balance = principal;
    const yearlyData = [];
    let runningContributions = principal;

    for (let month = 1; month <= totalMonths; month++) {
      balance = balance * (1 + monthlyRate) + contribution;
      runningContributions += contribution;

      if (month % 12 === 0) {
        const year = month / 12;
        yearlyData.push({
          year,
          balance,
          contributions: runningContributions,
          interest: balance - runningContributions,
        });
      }
    }

    const finalBalance = yearlyData.length ? yearlyData[yearlyData.length - 1].balance : principal;
    const totalContributions = principal + contribution * totalMonths;
    const totalInterest = finalBalance - totalContributions;

    return {
      finalBalance,
      totalContributions,
      totalInterest,
      yearlyData,
    };
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  function renderResults(container, result) {
    const resultsSection = container.querySelector('[data-results]');
    if (!resultsSection) return;

    resultsSection.classList.remove('hidden');

    const finalBalanceEl = resultsSection.querySelector('[data-result="balance"]');
    const contributionsEl = resultsSection.querySelector('[data-result="contributions"]');
    const interestEl = resultsSection.querySelector('[data-result="interest"]');

    if (finalBalanceEl) finalBalanceEl.textContent = formatCurrency(result.finalBalance);
    if (contributionsEl) contributionsEl.textContent = formatCurrency(result.totalContributions);
    if (interestEl) interestEl.textContent = formatCurrency(result.totalInterest);

    renderTable(resultsSection, result.yearlyData);
    renderChart(resultsSection, result.yearlyData);

    const copyBtn = resultsSection.querySelector('[data-copy-results]');
    if (copyBtn) {
      copyBtn.onclick = function () {
        copyResults(copyBtn, result);
      };
    }
  }

  function renderTable(section, yearlyData) {
    const tbody = section.querySelector('[data-breakdown-body]');
    if (!tbody) return;

    tbody.innerHTML = yearlyData
      .map(
        (row) => `
        <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
          <td class="py-3 px-4">${row.year}</td>
          <td class="py-3 px-4 text-right">${formatCurrency(row.balance)}</td>
          <td class="py-3 px-4 text-right">${formatCurrency(row.contributions)}</td>
          <td class="py-3 px-4 text-right">${formatCurrency(row.interest)}</td>
        </tr>
      `
      )
      .join('');
  }

  function renderChart(section, yearlyData) {
    const chartContainer = section.querySelector('[data-chart]');
    if (!chartContainer || yearlyData.length === 0) return;

    const width = 600;
    const height = 240;
    const padding = { top: 10, right: 10, bottom: 30, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxBalance = Math.max(...yearlyData.map((d) => d.balance));
    const barWidth = chartWidth / yearlyData.length * 0.6;
    const gap = chartWidth / yearlyData.length * 0.4;

    let bars = '';
    yearlyData.forEach((row, index) => {
      const x = padding.left + index * (barWidth + gap) + gap / 2;
      const barHeight = maxBalance > 0 ? (row.balance / maxBalance) * chartHeight : 0;
      const y = padding.top + chartHeight - barHeight;
      const interestHeight = maxBalance > 0 ? (row.interest / maxBalance) * chartHeight : 0;
      const contributionY = y + interestHeight;

      bars += `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="3" fill="#3b82f6" opacity="0.9" />
        <rect x="${x}" y="${contributionY}" width="${barWidth}" height="${Math.max(0, barHeight - interestHeight)}" rx="3" fill="#10b981" opacity="0.9" />
      `;
    });

    const xLabels = yearlyData
      .map((row, index) => {
        const x = padding.left + index * (barWidth + gap) + gap / 2 + barWidth / 2;
        return `<text x="${x}" y="${height - 8}" text-anchor="middle" font-size="11" fill="currentColor" class="text-slate-500">${row.year}</text>`;
      })
      .join('');

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto" role="img" aria-label="Year-by-year balance growth chart">
        <g>${bars}</g>
        <g>${xLabels}</g>
      </svg>
    `;

    chartContainer.innerHTML = svg;
  }

  function copyResults(button, result) {
    const text = `Compound Interest Results\n` +
      `Total Balance: ${formatCurrency(result.finalBalance)}\n` +
      `Total Contributions: ${formatCurrency(result.totalContributions)}\n` +
      `Total Interest Earned: ${formatCurrency(result.totalInterest)}`;

    navigator.clipboard.writeText(text).then(
      () => {
        const original = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = original;
        }, 1500);
      },
      () => {
        button.textContent = 'Copy failed';
        setTimeout(() => {
          button.textContent = 'Copy Results';
        }, 1500);
      }
    );
  }

  function init(container) {
    const form = container.querySelector('[data-calculator-form]');
    if (!form) return;

    const update = () => {
      const data = getInputs(container);
      const result = calculate(data);
      renderResults(container, result);
    };

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      update();
    });

    update();
  }

  document.querySelectorAll('[data-compound-interest-calculator]').forEach(init);
})();
