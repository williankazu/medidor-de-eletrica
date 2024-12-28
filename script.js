class ElectricalCalculator {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.mode = 'voltage-current';
        this.breakerSizes = [10, 16, 20, 25, 32, 40, 50, 63, 70, 80];
        this.updateCalculations();
    }

    initializeElements() {
        // Modo de cálculo
        this.voltageCurrentModeBtn = document.getElementById('voltageCurrentMode');
        this.powerModeBtn = document.getElementById('powerMode');
        
        // Controles principais
        this.voltageSlider = document.getElementById('voltageSlider');
        this.voltageInput = document.getElementById('voltageInput');
        this.voltageValue = document.getElementById('voltageValue');
        
        this.currentControl = document.getElementById('currentControl');
        this.currentSlider = document.getElementById('currentSlider');
        this.currentInput = document.getElementById('currentInput');
        this.currentValue = document.getElementById('currentValue');
        
        this.powerControls = document.getElementById('powerControls');
        this.powerSlider = document.getElementById('powerSlider');
        this.powerInput = document.getElementById('powerInput');
        this.powerValue = document.getElementById('powerValue');
        
        // Recomendações
        this.breakerValue = document.getElementById('breakerValue');
        this.nominalCurrent = document.getElementById('nominalCurrent');
        this.wireValue = document.getElementById('wireValue');
        this.wireCapacity = document.getElementById('wireCapacity');
        
        // Alertas
        this.alertsContainer = document.getElementById('alertsContainer');
    }

    initializeEventListeners() {
        this.voltageCurrentModeBtn.addEventListener('click', () => this.setMode('voltage-current'));
        this.powerModeBtn.addEventListener('click', () => this.setMode('power'));
        
        this.voltageSlider.addEventListener('input', (e) => this.handleVoltageChange(e.target.value));
        this.voltageInput.addEventListener('change', (e) => this.handleVoltageChange(e.target.value));
        
        this.currentSlider.addEventListener('input', (e) => this.handleCurrentChange(e.target.value));
        this.currentInput.addEventListener('change', (e) => this.handleCurrentChange(e.target.value));
        
        this.powerSlider.addEventListener('input', (e) => this.handlePowerChange(e.target.value));
        this.powerInput.addEventListener('change', (e) => this.handlePowerChange(e.target.value));
    }

    setMode(newMode) {
        this.mode = newMode;
        
        this.voltageCurrentModeBtn.classList.toggle('active', newMode === 'voltage-current');
        this.powerModeBtn.classList.toggle('active', newMode === 'power');
        
        this.currentControl.style.display = newMode === 'voltage-current' ? 'block' : 'none';
        this.powerControls.style.display = newMode === 'power' ? 'block' : 'none';
        
        this.updateCalculations();
    }

    handleVoltageChange(value) {
        const voltage = Number(value);
        this.voltageSlider.value = voltage;
        this.voltageInput.value = voltage;
        this.voltageValue.textContent = voltage;
        this.updateCalculations();
    }

    handleCurrentChange(value) {
        const current = Number(value);
        this.currentSlider.value = current;
        this.currentInput.value = current;
        this.currentValue.textContent = current.toFixed(1);
        this.updateCalculations();
    }

    handlePowerChange(value) {
        const power = Number(value);
        this.powerSlider.value = power;
        this.powerInput.value = power;
        this.powerValue.textContent = power;
        
        // Calcular corrente baseada na potência
        const current = power / Number(this.voltageSlider.value);
        this.currentValue.textContent = current.toFixed(1);
        
        this.updateCalculations();
    }

    updateCalculations() {
        let current;
        let voltage = Number(this.voltageSlider.value);
        let alerts = [];

        // Cálculos baseados no modo
        if (this.mode === 'voltage-current') {
            current = Number(this.currentSlider.value);
            const power = voltage * current;
            this.powerValue.textContent = power.toFixed(0);
        } else {
            const power = Number(this.powerSlider.value);
            current = power / voltage;
            this.currentValue.textContent = current.toFixed(1);
        }

        // Verificar tensão
        if (voltage < 110 || voltage > 380) {
            alerts.push("Tensão fora da faixa recomendada (110V-380V)");
        }

        // Cálculo do disjuntor
        const minBreaker = current * 1.25; // Fator de segurança de 25%
        const recommendedBreaker = this.breakerSizes.find(size => size >= minBreaker) || this.breakerSizes[this.breakerSizes.length - 1];
        
        // Atualizar valores do disjuntor
        this.breakerValue.textContent = `${recommendedBreaker}A`;
        this.nominalCurrent.textContent = `${current.toFixed(1)}A`;

        // Cálculo da bitola do fio
        let wireSize;
        let wireCapacity;
        if (current <= 10) {
            wireSize = "1.5";
            wireCapacity = 10;
        } else if (current <= 16) {
            wireSize = "2.5";
            wireCapacity = 16;
        } else if (current <= 25) {
            wireSize = "4";
            wireCapacity = 25;
        } else if (current <= 32) {
            wireSize = "6";
            wireCapacity = 32;
        } else if (current <= 40) {
            wireSize = "10";
            wireCapacity = 40;
        } else {
            wireSize = "16";
            wireCapacity = 50;
        }

        // Atualizar valores do fio
        this.wireValue.textContent = `${wireSize}mm²`;
        this.wireCapacity.textContent = `${wireCapacity}A`;

        // Verificar sobrecargas
        if (current > wireCapacity) {
            alerts.push(`Corrente excede a capacidade do fio (máx: ${wireCapacity}A)`);
        }
        if (current > recommendedBreaker) {
            alerts.push("Corrente excede a capacidade do disjuntor!");
        }

        // Atualizar alertas
        this.alertsContainer.innerHTML = alerts
            .map(alert => `
                <div class="alert">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ${alert}
                </div>
            `)
            .join('');
    }

    calculateWireLoad(current, wireCapacity) {
        return Math.min((current / wireCapacity) * 100, 100);
    }
}

// Inicializar calculadora quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new ElectricalCalculator();
});