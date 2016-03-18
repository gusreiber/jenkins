package jenkins.model.item_category;

import hudson.Extension;
import hudson.ExtensionPoint;
import hudson.model.ModelObject;
import jenkins.model.Messages;

/**
 * A category for {@link hudson.model.Item}s.
 */
public abstract class ItemCategory implements ModelObject, ExtensionPoint {

    public static int MIN_WEIGHT = Integer.MIN_VALUE;

    public static int MIN_TOSHOW = 1;

    /**
     * Identifier, e.g. "category-id-default", etc.
     *
     * @return the identifier
     */
    public abstract String getId();

    /**
     * The icon class specification e.g. 'category-icon-folder', 'category-icon-default', etc.
     *
     * @return the icon class specification
     */
    public abstract String getIconClassName();

    /**
     * The description in plain text
     *
     * @return the description
     */
    public abstract String getDescription();

    /**
     * Helpful to set the order.
     *
     * @return the weight
     */
    public abstract int getWeight();

    /**
     * Minimum number required to show the category.
     *
     * @return the minimum items required
     */
    public abstract int getMinToShow();

    /**
     * The default category, if an item doesn't belong anywhere else, this is where it goes by default.
     */
    @Extension
    public static final class Default extends ItemCategory {

        @Override
        public String getId() {
            return "category-id-default";
        }

        @Override
        public String getIconClassName() {
            return "category-icon-default";
        }

        @Override
        public String getDescription() {
            return Messages.ItemCategory_Default_Description();
        }

        @Override
        public String getDisplayName() {
            return Messages.ItemCategory_Default_DisplayName();
        }

        @Override
        public int getWeight() {
            return Integer.MIN_VALUE;
        }

        @Override
        public int getMinToShow() {
            return 1;
        }

    }

}
