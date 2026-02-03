import { ParsedBudget, BudgetItem } from '../types';

export const parseBudgetHtml = (htmlContent: string): ParsedBudget => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const divs = Array.from(doc.querySelectorAll('div'));

  const header = { orcamento: '', cliente: '', data: '' };
  const linhasItens: Record<number, Partial<BudgetItem>> = {};

  divs.forEach((div) => {
    // Determine exact position from inline styles
    const topStr = div.style.top?.replace('px', '') || '0';
    const leftStr = div.style.left?.replace('px', '') || '0';
    
    const top = parseInt(topStr, 10);
    const left = parseInt(leftStr, 10);
    const text = div.innerText.trim();

    if (!text) return;

    // --- Header Extraction Logic ---
    if (top >= 150 && top <= 160) {
      if (left === 61) header.orcamento = text;
      if (left === 177) header.data = text;
    }
    
    if (top >= 165 && top <= 180 && left >= 400) {
      header.cliente += (header.cliente ? " " : "") + text;
    }

    // --- Table Items Extraction Logic ---
    if (top > 370) {
      // Grouping logic with tolerance
      let linhaChave = Object.keys(linhasItens).map(Number).find(t => Math.abs(t - top) <= 3);
      
      if (!linhaChave) {
        linhaChave = top;
        linhasItens[linhaChave] = { topPosition: top, item: '', cod: '', desc: '', qtd: '' };
      }

      const row = linhasItens[linhaChave];
      
      const isRightAligned = div.style.textAlign === 'right';
      const styleWidth = div.style.width || '';
      
      // Determine if this is the quantity column
      // We check for specific legacy widths or if it's positioned far to the right
      const isQty = (isRightAligned && (styleWidth.includes('546') || styleWidth.includes('643'))) || left > 700;

      // Mapping based on X position (Left)
      // Using ranges to be more robust against slight layout variations
      if (left >= 10 && left <= 40) { // Item number usually at 19
        row.item = text;
      } else if (left >= 45 && left <= 80) { // Code usually at 51
        row.cod = text;
      } else if (isQty) {
         if (!row.qtd) row.qtd = text;
      } else if (left >= 85) { 
        // Description - catch all text in the middle zone
        // Previous logic limited to 400px which cut off long descriptions
        row.desc = (row.desc ? row.desc + ' ' : '') + text;
      }
    }
  });

  // --- Post-Processing: Handle Multi-line Descriptions ---
  // Sort all detected lines by vertical position
  const sortedRawRows = Object.values(linhasItens).sort((a, b) => (a.topPosition || 0) - (b.topPosition || 0));
  
  const finalItems: BudgetItem[] = [];
  let lastValidItem: BudgetItem | null = null;

  sortedRawRows.forEach((row, index) => {
    // Check if it's a complete valid item (has item # and code)
    if (row.item && row.cod) {
      const newItem: BudgetItem = {
        id: `item-${index}-${row.cod}`,
        item: row.item,
        cod: row.cod,
        desc: row.desc || '',
        qtd: row.qtd || '',
        topPosition: row.topPosition || 0
      };
      finalItems.push(newItem);
      lastValidItem = newItem;
    } 
    // If it lacks Code/Item but has description, assume it's a continuation of the previous item
    else if (row.desc && !row.cod && lastValidItem) {
      lastValidItem.desc += " " + row.desc;
    }
  });

  // --- Filtering: Remove Services ---
  const filteredItems = finalItems.filter(item => {
    const descUpper = item.desc.toUpperCase();
    const serviceKeywords = [
      'PRESTAÇÃO DE SERVIÇO', 
      'PRESTACAO DE SERVICO', 
      'MÃO DE OBRA', 
      'MAO DE OBRA',
      'SERVIÇOS PRESTADOS',
      // Palavras-chave adicionais baseadas em itens de serviço comuns
      'REVISÃO',
      'REVISAO',
      'SUBSTITUIR',
      'RECUPERAR',
      'REMOVER',
      'INSTALAR',
      'INSTALACAO',
      'INSTALAÇÃO',
      'TROCAR',
      'ALINHAMENTO',
      'BALANCEAMENTO',
      'DESMONTAGEM',
      'MONTAGEM',
      'REGULAGEM',
      'LAVAGEM',
      'HIGIENIZAÇÃO'
    ];
    
    // Verifica se alguma palavra-chave está presente na descrição
    return !serviceKeywords.some(keyword => descUpper.includes(keyword));
  });

  return { header, items: filteredItems };
};