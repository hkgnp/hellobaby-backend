const forms = require('forms');

// create shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = (name, object) => {
  if (!Array.isArray(object.widget.classes)) {
    object.widget.classes = [];
  }

  if (object.widget.classes.indexOf('form-control') === -1) {
    object.widget.classes.push('form-control');
  }

  let validationclass = object.value && !object.error ? 'is-valid' : '';
  validationclass = object.error ? 'is-invalid' : validationclass;
  if (validationclass) {
    object.widget.classes.push(validationclass);
  }

  let label = object.labelHTML(name);
  let error = object.error
    ? '<div class="invalid-feedback">' + object.error + '</div>'
    : '';

  let widget = object.widget.toHTML(name, object);
  return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = (categories, tags, yesNo) => {
  return forms.create({
    date_added: fields.date({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      widget: widgets.date(),
    }),
    name: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    description: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      widget: widgets.textarea(),
    }),
    cost: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      validators: [validators.integer()],
    }),
    company: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    size: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    stock: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    local: fields.boolean({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      widget: widgets.select(),
      choices: yesNo,
    }),
    organic_natural: fields.string({
      label: 'Organic / Natural',
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      widget: widgets.select(),
      choices: yesNo,
    }),
    free_delivery: fields.string({
      label: 'Free Delivery',
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      widget: widgets.select(),
      choices: yesNo,
    }),
    category_id: fields.string({
      label: 'Category',
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      widget: widgets.select(),
      choices: categories,
    }),
    tags: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      widget: widgets.multipleSelect(),
      choices: tags,
    }),
    img_url: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.hidden(),
    }),
    thumbnail_url: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.hidden(),
    }),
    user_id: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.hidden(),
    }),
  });
};

const createProductSearchForm = (categories, tags) => {
  return forms.create({
    date: fields.date({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      widget: widgets.date(),
    }),
    name: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    description: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    min_cost: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      validators: [validators.integer()],
    }),
    max_cost: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      validators: [validators.integer()],
    }),
    company: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    description: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    min_stock: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    max_stock: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    local: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    organic_natural: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    category_id: fields.string({
      label: 'Category',
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      widget: widgets.select(),
      choices: categories,
    }),
    tags: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      widget: widgets.multipleSelect(),
      choices: tags,
    }),
  });
};

const createUserForm = () => {
  return forms.create({
    username: fields.string({
      label: 'Your Name',
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      validators: [validators.email()],
    }),
    address: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    postal_code: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    confirm_password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
      validators: [validators.matchField('password')],
    }),
  });
};

const loginUserForm = () => {
  return forms.create({
    email: fields.email({
      validators: [validators.email()],
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
  });
};

const addCategoryAddTags = () => {
  return forms.create({
    category_name: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
    tag_name: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label'],
      },
    }),
  });
};

module.exports = {
  bootstrapField,
  createProductForm,
  createProductSearchForm,
  createUserForm,
  loginUserForm,
  addCategoryAddTags,
};
