import exportConfig from "~/assets/capella-icons/export-config.png";
import importConfig from "~/assets/capella-icons/import-config.png";
import filter from "~/assets/capella-icons/filter.png";
import logicalComponent from "~/assets/capella-icons/logical-component.png";
import logicalFunction from "~/assets/capella-icons/logical-function.png";
import functionalExchange from "~/assets/capella-icons/functional-exchange.png";
import domain from "~/assets/capella-icons/domain.png";
import newDomain from "~/assets/capella-icons/new-domain.png";
import openCurrentConfigFile from "~/assets/capella-icons/open-current-config-file.png";
import physicalComponent from "~/assets/capella-icons/physical-component.png";
import propertyValues from "~/assets/capella-icons/property-values.png";
import search from "~/assets/capella-icons/search.png";
import extension from "~/assets/capella-icons/extension.png";
import createExtension from "~/assets/capella-icons/create-extension.png";
import scope from "~/assets/capella-icons/scope.png";
import createEclassRule from "~/assets/capella-icons/create-eclass-rule.png";
import eclassRule from "~/assets/capella-icons/eclass-rule.png";
import createEnumerationDefinition from "~/assets/capella-icons/create-enumeration-definition.png";
import enumerationDefinition from "~/assets/capella-icons/enumeration-definition.png";
import createEnumerationLiteral from "~/assets/capella-icons/create-enumeration-literal.png";
import createBackgroundColor from "~/assets/capella-icons/create-background-color.png";

const icons = {
  exportConfig,
  importConfig,
  filter,
  logicalComponent,
  logicalFunction,
  functionalExchange,
  domain,
  newDomain,
  openCurrentConfigFile,
  physicalComponent,
  propertyValues,
  search,
  extension,
  createExtension,
  scope,
  eclassRule,
  createEclassRule,
  enumerationDefinition,
  createEnumerationDefinition,
  createEnumerationLiteral,
  createBackgroundColor,
};

type IconName = keyof typeof icons;

const CaIcon = ({ name }: { name: IconName }) => {
  return <img src={icons[name]} className="not-prose inline-block w-4" />;
};

export default CaIcon;
