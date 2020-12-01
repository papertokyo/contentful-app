import React from 'react';
import { isEmpty, findIndex } from 'lodash';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import Field from '../components/field';

export class EntryField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
    };

    this.onOpenDialogClick = this.onOpenDialogClick.bind(this);
    this.onDeleteProduct = this.onDeleteProduct.bind(this);
  }

  async onOpenDialogClick(options = {}) {
    const { products } = this.state;
    const {
      sdk: {
        dialogs: { openCurrentApp },
      },
    } = this.props;
    const { multiselect = false } = options;

    const result = await openCurrentApp({
      allowHeightOverflow: true,
      position: 'center',
      title: multiselect ? 'Select products' : 'Select a product',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      parameters: { multiselect, products },
      width: 1400,
    });

    if (result && !isEmpty(result.products)) {
      this.setState({ products: result.products });
    }
  }

  onDeleteProduct(id) {
    const { products } = this.state;
    const index = findIndex(products, { id });

    if (index !== -1) {
      products.splice(index, 1);
      this.setState({ products });
    }
  }

  render() {
    const {
      sdk: { field },
    } = this.props;
    const { products } = this.state;

    return (
      <Field
        field={field}
        products={products}
        onDelete={this.onDeleteProduct}
        onOpenDialog={this.onOpenDialogClick}
      />
    );
  }
}

export default EntryField;
