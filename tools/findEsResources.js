const queryModule = {
  'Property[key.name="stylesheets"]' (node) {
    return (node.value.elements || []).flatMap((element) => {
      if (element.type === 'Literal') {
        return element.value;
      }
      // if (element.type === 'ArrayExpression') {
      return element.elements.flatMap((arrayItem) => {
        if (arrayItem.type === 'Literal') {
          return arrayItem.value;
        }
        // Ignore
        return [];
      });
    });
  }
};

export default queryModule;
