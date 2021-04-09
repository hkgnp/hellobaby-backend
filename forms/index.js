const forms = require('forms');

// create shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
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

const createProductForm = (categories, tags) => {
  return forms.create({
    title: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    cost: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      validators: [validators.integer()],
    }),
    description: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    date: fields.date({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      widget: widgets.date(),
    }),
    stock: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    height: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    width: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    category_id: fields.string({
      label: 'Category',
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      widget: widgets.select(),
      choices: categories,
    }),
    tags: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
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
  });
};

const createProductSearchForm = (categories, tags) => {
  return forms.create({
    title: fields.string({
      required: false,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    min_cost: fields.string({
      required: false,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      validators: [validators.integer()],
    }),
    max_cost: fields.string({
      required: false,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      validators: [validators.integer()],
    }),
    description: fields.string({
      required: false,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    date: fields.date({
      required: false,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      widget: widgets.date(),
    }),
    min_stock: fields.string({
      required: false,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    max_stock: fields.string({
      required: false,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    height: fields.string({
      required: false,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    width: fields.string({
      required: false,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    category_id: fields.string({
      label: 'Category',
      required: false,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      widget: widgets.select(),
      choices: categories,
    }),
    tags: fields.string({
      required: false,
      errorAfterField: true,
      cssClass: {
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
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      validators: [validators.email()],
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    confirm_password: fields.password({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      validators: [validators.matchField('password')],
    }),
  });
};

const loginUserForm = () => {
  return forms.create({
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      validators: [validators.email()],
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
  });
};

const userProfile = () => {
  return forms.create({
    username: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
    }),
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClass: {
        label: ['form-label'],
      },
      validators: [validators.email()],
    }),
  });
};

module.exports = {
  bootstrapField,
  createProductForm,
  createProductSearchForm,
  createUserForm,
  loginUserForm,
  userProfile,
};
