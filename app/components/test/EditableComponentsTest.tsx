'use client';

import React, { useState } from 'react';
import { EditableField } from '../ui/editable-field';
import { HoverControls, EditButtonControl } from '../ui/hover-controls';
import { ExpandableCard } from '../ui/expandable-card';
import { SectionVisibilityManager } from '../ui/section-visibility-manager';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Edit2, Plus } from 'lucide-react';

const EditableComponentsTest = () => {
  const [name, setName] = useState('John Doe');
  const [bio, setBio] = useState('This is my bio text. It can be edited directly.');
  const [cardTitle, setCardTitle] = useState('Spotlight Item');
  const [cardDescription, setCardDescription] = useState('This is a spotlight card that can be expanded for editing.');
  const [visibility, setVisibility] = useState({
    spotlight: true,
    media: true,
    shop: true,
    sticker: true
  });

  // Handler for section visibility changes
  const handleVisibilityChange = (field: keyof typeof visibility, value: boolean) => {
    setVisibility(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-4">Editable Components Test</h1>
        <p className="text-gray-400">Hover over items to see edit controls</p>
      </div>

      <div className="space-y-8">
        {/* Editable Field Examples */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">EditableField Component</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Single Line Text:</h3>
                <EditableField 
                  value={name} 
                  onSave={setName}
                  placeholder="Enter your name"
                  className="p-2 border border-gray-700/50 rounded-lg"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Multiline Text:</h3>
                <EditableField 
                  value={bio} 
                  onSave={setBio}
                  placeholder="Write something about yourself"
                  multiline
                  rows={4}
                  className="p-2 border border-gray-700/50 rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HoverControls Example */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">HoverControls Component</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Hover to reveal controls:</h3>
                <HoverControls
                  controls={
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </div>
                  }
                  className="p-4 border border-gray-700/50 rounded-lg"
                >
                  <p>Hover over this area to see controls appear.</p>
                  <p className="text-gray-400 text-sm mt-2">This simulates how section controls will work.</p>
                </HoverControls>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">EditButtonControl shorthand:</h3>
                <EditButtonControl
                  onEdit={() => alert('Edit button clicked')}
                  icon={<Edit2 className="w-4 h-4 mr-1" />}
                  className="p-4 border border-gray-700/50 rounded-lg"
                >
                  <p>This is a shorthand for common edit button pattern.</p>
                  <p className="text-gray-400 text-sm mt-2">Hover to see the edit button.</p>
                </EditButtonControl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ExpandableCard Example */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">ExpandableCard Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExpandableCard
                title={<h3 className="text-lg font-medium">{cardTitle}</h3>}
                expandedContent={
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Title:</h4>
                      <EditableField 
                        value={cardTitle} 
                        onSave={setCardTitle}
                        hideEditButton
                        showControls={false}
                        className="p-2 border border-gray-700/50 rounded-lg"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Description:</h4>
                      <EditableField 
                        value={cardDescription} 
                        onSave={setCardDescription}
                        multiline
                        rows={4}
                        hideEditButton
                        showControls={false}
                        className="p-2 border border-gray-700/50 rounded-lg"
                      />
                    </div>
                  </div>
                }
                className="group border border-gray-700/50"
              >
                <div className="space-y-2">
                  <p>{cardDescription}</p>
                </div>
              </ExpandableCard>
              
              <div className="flex items-center justify-center p-6 border border-dashed border-gray-700/50 rounded-lg">
                <Button variant="ghost" className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Card
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SectionVisibilityManager Example */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">SectionVisibilityManager Component</h2>
            
            <div className="space-y-4">
              <SectionVisibilityManager
                visibility={visibility}
                onVisibilityChange={handleVisibilityChange}
              />
              
              <div className="mt-4 p-4 border border-gray-700/50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Current Visibility State:</h3>
                <pre className="bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(visibility, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditableComponentsTest; 