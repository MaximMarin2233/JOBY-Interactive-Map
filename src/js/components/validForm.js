import JustValidate from 'just-validate';

export function validForm(selector, rules, func) {
  const validation = new JustValidate(selector);

  for (let item of rules) {
    validation
      .addField(item.ruleSelector, item.rules);
  }

  validation.onSuccess(func);
}
