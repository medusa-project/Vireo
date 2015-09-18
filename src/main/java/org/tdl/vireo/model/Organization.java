package org.tdl.vireo.model;

import java.util.Set;

import javax.persistence.Entity;

@Entity
public class Organization extends BaseEntity {
	Set<Organization> parentOrganizations;
	Set<Organization> childrenOrganizations;
	Workflow workflow;
	String name;
	Set<String> emails;

	/**
	 * @return the parentOrganizations
	 */
	public Set<Organization> getParentOrganizations() {
		return parentOrganizations;
	}

	/**
	 * @param parentOrganizations
	 *            the parentOrganizations to set
	 */
	public void setParentOrganizations(Set<Organization> parentOrganizations) {
		this.parentOrganizations = parentOrganizations;
	}

	/**
	 * @return the childrenOrganizations
	 */
	public Set<Organization> getChildrenOrganizations() {
		return childrenOrganizations;
	}

	/**
	 * @param childrenOrganizations
	 *            the childrenOrganizations to set
	 */
	public void setChildrenOrganizations(Set<Organization> childrenOrganizations) {
		this.childrenOrganizations = childrenOrganizations;
	}

	/**
	 * @return the workflow
	 */
	public Workflow getWorkflow() {
		return workflow;
	}

	/**
	 * @param workflow
	 *            the workflow to set
	 */
	public void setWorkflow(Workflow workflow) {
		this.workflow = workflow;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name
	 *            the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the emails
	 */
	public Set<String> getEmails() {
		return emails;
	}

	/**
	 * @param emails
	 *            the emails to set
	 */
	public void setEmails(Set<String> emails) {
		this.emails = emails;
	}
}
